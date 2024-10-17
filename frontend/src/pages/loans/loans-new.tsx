import {
  mdiAccount,
  mdiChartTimelineVariant,
  mdiMail,
  mdiUpload,
} from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SwitchField } from '../../components/SwitchField';

import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { RichTextField } from '../../components/RichTextField';

import { create } from '../../stores/loans/loansSlice';
import { useAppDispatch } from '../../stores/hooks';
import { useRouter } from 'next/router';
import moment from 'moment';

const initialValues = {
  borrower: '',

  loan_amount: '',

  bitcoin_collateral: '',

  interest_rate: '',

  loan_sanction_date: '',

  bank_account_details: '',

  lender: '',
};

const LoansNew = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (data) => {
    await dispatch(create(data));
    await router.push('/loans/loans-list');
  };
  return (
    <>
      <Head>
        <title>{getPageTitle('New Item')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title='New Item'
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='Borrower' labelFor='borrower'>
                <Field
                  name='borrower'
                  id='borrower'
                  component={SelectField}
                  options={[]}
                  itemRef={'users'}
                ></Field>
              </FormField>

              <FormField label='LoanAmount'>
                <Field
                  type='number'
                  name='loan_amount'
                  placeholder='LoanAmount'
                />
              </FormField>

              <FormField label='BitcoinCollateral'>
                <Field
                  type='number'
                  name='bitcoin_collateral'
                  placeholder='BitcoinCollateral'
                />
              </FormField>

              <FormField label='InterestRate'>
                <Field
                  type='number'
                  name='interest_rate'
                  placeholder='InterestRate'
                />
              </FormField>

              <FormField label='LoanSanctionDate'>
                <Field
                  type='datetime-local'
                  name='loan_sanction_date'
                  placeholder='LoanSanctionDate'
                />
              </FormField>

              <FormField label='BankAccountDetails'>
                <Field
                  name='bank_account_details'
                  placeholder='BankAccountDetails'
                />
              </FormField>

              <FormField label='Lender' labelFor='lender'>
                <Field
                  name='lender'
                  id='lender'
                  component={SelectField}
                  options={[]}
                  itemRef={'users'}
                ></Field>
              </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() => router.push('/loans/loans-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

LoansNew.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'CREATE_LOANS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default LoansNew;
