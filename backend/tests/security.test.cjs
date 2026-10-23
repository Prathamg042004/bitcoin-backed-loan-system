const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const nativeRequire=require;
function moduleAt(file,dependencies={},env={}) {
  const module={exports:{}};
  vm.runInNewContext(fs.readFileSync(__dirname+'/../src/'+file,'utf8'),{module,exports:module.exports,require:name=>name in dependencies?dependencies[name]:nativeRequire(name),process:{env},URL,console});
  return module.exports;
}
test('permission checks cannot be bypassed with a submitted or matching account ID',async()=>{
  const {checkPermissions}=moduleAt('middlewares/check-permissions.js',{'../services/notifications/errors/validation':class extends Error{}});
  for(const req of [{currentUser:{id:'attacker',custom_permissions:[]},params:{},body:{id:'attacker'}},{currentUser:{id:'attacker',custom_permissions:[]},params:{id:'attacker'},body:{}}]) {
    let denied=false;checkPermissions('UPDATE_ROLES')(req,{},error=>{denied=!!error;});assert.equal(denied,true);
  }
  let allowed=false;checkPermissions('READ_LOANS')({currentUser:{custom_permissions:[{name:'READ_LOANS'}]}},{},error=>{allowed=!error;});assert.equal(allowed,true);
});
test('production refuses weak JWT configuration and development keys are not static',()=>{
  assert.throws(()=>moduleAt('config.js',{}, {NODE_ENV:'production'}),/JWT_SECRET/);
  assert.throws(()=>moduleAt('config.js',{}, {NODE_ENV:'production',JWT_SECRET:'x'.repeat(32)}),/APP_API_ORIGIN/);
  const a=moduleAt('config.js');const b=moduleAt('config.js');
  assert.notEqual(a.secret_key,b.secret_key);assert.ok(a.secret_key.length>=32);
  assert.notEqual(a.admin_pass,'password');assert.equal(a.email.tls.rejectUnauthorized,true);
  assert.equal(a.google.clientSecret,'');assert.equal(a.microsoft.clientSecret,'');assert.equal(a.pexelsKey,'');
});
function auth(deps={}) {
  const calls=[];
  const db={users:{update:async(values,options)=>{calls.push({values,options});}}};
  const api={findBy:async()=>({id:'existing',password:'stored'}),updatePassword:async()=>assert.fail('must not overwrite an existing password')};
  const mocks={
    '../db/api/users':api,'./notifications/errors/validation':class extends Error{},'./notifications/errors/forbidden':class extends Error{},
    bcrypt:{hash:async()=> 'hashed'},'./email/list/addressVerification':class{},'./email/list/invitation':class{},'./email/list/passwordReset':class{},'./email':class{},
    '../config':{bcrypt:{saltRounds:12},uiOrigin:'https://trusted.example.test'},'../helpers':{},'../db/models':db,...deps,
  };
  return {service:moduleAt('services/auth.js',mocks),calls};
}
test('signup cannot overwrite an existing account password',async()=>{
  const {service}=auth();await assert.rejects(service.signup('existing@example.test','test-password'));
});
test('profile edits reject role and verification escalation and only update the current user',async()=>{
  const {service,calls}=auth();
  for(const data of [{app_role:'admin'},{custom_permissions:['all']},{emailVerified:true},{email:'other@example.test'},{password:'changed'}]) await assert.rejects(service.updateProfile(data,{id:'self'}));
  assert.equal(calls.length,0);
  await service.updateProfile({firstName:' Demo '},{id:'self'});
  assert.equal(calls.length,1);assert.equal(calls[0].values.firstName,'Demo');assert.equal(calls[0].options.where.id,'self');
});

test('production login does not bypass email verification when email is unconfigured',async()=>{
  const service=moduleAt('services/auth.js',{
    '../db/api/users':{findBy:async()=>({id:'demo',password:'stored',emailVerified:false})},
    './notifications/errors/validation':class extends Error{},'./notifications/errors/forbidden':class extends Error{},
    bcrypt:{compare:async()=>true},'./email/list/addressVerification':class{},'./email/list/invitation':class{},'./email/list/passwordReset':class{},'./email':class{},
    '../config':{bcrypt:{saltRounds:12}},'../helpers':{jwtSign:()=>assert.fail('must not issue token')},'../db/models':{},
  },{NODE_ENV:'production'});
  await assert.rejects(service.signin('demo@example.test','test-password'),/auth.userNotVerified/);
});
