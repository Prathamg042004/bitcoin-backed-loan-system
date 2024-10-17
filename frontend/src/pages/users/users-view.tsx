import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/users/usersSlice';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import BaseButton from '../../components/BaseButton';
import BaseDivider from '../../components/BaseDivider';
import { mdiChartTimelineVariant } from '@mdi/js';
import { SwitchField } from '../../components/SwitchField';
import FormField from '../../components/FormField';

const UsersView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);

  const { id } = router.query;

  function removeLastCharacter(str) {
    console.log(str, `str`);
    return str.slice(0, -1);
  }

  useEffect(() => {
    dispatch(fetch({ id }));
  }, [dispatch, id]);

  return (
    <>
      <Head>
        <title>{getPageTitle('View users')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View users')}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>First Name</p>
            <p>{users?.firstName}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Last Name</p>
            <p>{users?.lastName}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Phone Number</p>
            <p>{users?.phoneNumber}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>E-Mail</p>
            <p>{users?.email}</p>
          </div>

          <FormField label='Disabled'>
            <SwitchField
              field={{ name: 'disabled', value: users?.disabled }}
              form={{ setFieldValue: () => null }}
              disabled
            />
          </FormField>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Avatar</p>
            {users?.avatar?.length ? (
              <ImageField
                name={'avatar'}
                image={users?.avatar}
                className='w-20 h-20'
              />
            ) : (
              <p>No Avatar</p>
            )}
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>App Role</p>

            <p>{users?.app_role?.name ?? 'No data'}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Custom Permissions</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.custom_permissions &&
                      Array.isArray(users.custom_permissions) &&
                      users.custom_permissions.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/permissions/permissions-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='name'>{item.name}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!users?.custom_permissions?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Password Reset Token</p>
            <p>{users?.passwordResetToken}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Email Verification Token</p>
            <p>{users?.emailVerificationToken}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Loans Borrower</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>LoanAmount</th>

                      <th>BitcoinCollateral</th>

                      <th>InterestRate</th>

                      <th>LoanSanctionDate</th>

                      <th>BankAccountDetails</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.loans_borrower &&
                      Array.isArray(users.loans_borrower) &&
                      users.loans_borrower.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/loans/loans-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='loan_amount'>{item.loan_amount}</td>

                          <td data-label='bitcoin_collateral'>
                            {item.bitcoin_collateral}
                          </td>

                          <td data-label='interest_rate'>
                            {item.interest_rate}
                          </td>

                          <td data-label='loan_sanction_date'>
                            {dataFormatter.dateTimeFormatter(
                              item.loan_sanction_date,
                            )}
                          </td>

                          <td data-label='bank_account_details'>
                            {item.bank_account_details}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!users?.loans_borrower?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Loans Lender</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>LoanAmount</th>

                      <th>BitcoinCollateral</th>

                      <th>InterestRate</th>

                      <th>LoanSanctionDate</th>

                      <th>BankAccountDetails</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.loans_lender &&
                      Array.isArray(users.loans_lender) &&
                      users.loans_lender.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/loans/loans-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='loan_amount'>{item.loan_amount}</td>

                          <td data-label='bitcoin_collateral'>
                            {item.bitcoin_collateral}
                          </td>

                          <td data-label='interest_rate'>
                            {item.interest_rate}
                          </td>

                          <td data-label='loan_sanction_date'>
                            {dataFormatter.dateTimeFormatter(
                              item.loan_sanction_date,
                            )}
                          </td>

                          <td data-label='bank_account_details'>
                            {item.bank_account_details}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!users?.loans_lender?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Virtual_wallets Owner</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>BitcoinBalance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.virtual_wallets_owner &&
                      Array.isArray(users.virtual_wallets_owner) &&
                      users.virtual_wallets_owner.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/virtual_wallets/virtual_wallets-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='bitcoin_balance'>
                            {item.bitcoin_balance}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!users?.virtual_wallets_owner?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/users/users-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

UsersView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_USERS'}>{page}</LayoutAuthenticated>
  );
};

export default UsersView;
