import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

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
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import {
  update,
  fetch,
} from '../../stores/virtual_wallets/virtual_walletsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

const EditVirtual_wallets = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    owner: '',

    bitcoin_balance: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { virtual_wallets } = useAppSelector((state) => state.virtual_wallets);

  const { virtual_walletsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: virtual_walletsId }));
  }, [virtual_walletsId]);

  useEffect(() => {
    if (typeof virtual_wallets === 'object') {
      setInitialValues(virtual_wallets);
    }
  }, [virtual_wallets]);

  useEffect(() => {
    if (typeof virtual_wallets === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = virtual_wallets[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [virtual_wallets]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: virtual_walletsId, data }));
    await router.push('/virtual_wallets/virtual_wallets-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit virtual_wallets')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit virtual_wallets'}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='Owner' labelFor='owner'>
                <Field
                  name='owner'
                  id='owner'
                  component={SelectField}
                  options={initialValues.owner}
                  itemRef={'users'}
                  showField={'firstName'}
                ></Field>
              </FormField>

              <FormField label='BitcoinBalance'>
                <Field
                  type='number'
                  name='bitcoin_balance'
                  placeholder='BitcoinBalance'
                />
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
                  onClick={() =>
                    router.push('/virtual_wallets/virtual_wallets-list')
                  }
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditVirtual_wallets.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_VIRTUAL_WALLETS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditVirtual_wallets;
