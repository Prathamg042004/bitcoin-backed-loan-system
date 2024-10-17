import React, { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAppSelector } from '../../stores/hooks';
import LayoutGuest from '../../layouts/Guest';
import WebSiteHeader from '../../components/WebPageComponents/Header';
import WebSiteFooter from '../../components/WebPageComponents/Footer';
import {
  HeroDesigns,
  FaqDesigns,
  ContactFormDesigns,
} from '../../components/WebPageComponents/designs';

import HeroSection from '../../components/WebPageComponents/HeroComponent';

import FaqSection from '../../components/WebPageComponents/FaqComponent';

import ContactFormSection from '../../components/WebPageComponents/ContactFormComponent';

export default function WebSite() {
  const cardsStyle = useAppSelector((state) => state.style.cardsStyle);
  const bgColor = useAppSelector((state) => state.style.bgLayoutColor);
  const projectName = 'bitcoin backed loan system';

  useEffect(() => {
    const darkElement = document.querySelector('body .dark');
    if (darkElement) {
      darkElement.classList.remove('dark');
    }
  }, []);
  const pages = [
    {
      href: '/home',
      label: 'home',
    },

    {
      href: '/services',
      label: 'services',
    },

    {
      href: '/contact',
      label: 'contact',
    },

    {
      href: '/pricing',
      label: 'pricing',
    },

    {
      href: '/home',
      label: 'home',
    },

    {
      href: '/services',
      label: 'services',
    },

    {
      href: '/faq',
      label: 'FAQ',
    },

    {
      href: '/contact',
      label: 'contact',
    },

    {
      href: '/pricing',
      label: 'pricing',
    },

    {
      href: '/faq',
      label: 'FAQ',
    },
  ];

  const faqs = [
    {
      question: 'How can I contact support?',
      answer:
        'You can contact support through the contact form on this page, or email us directly.',
    },
    {
      question: 'What is the response time for inquiries?',
      answer:
        'We aim to respond to all inquiries within 24 hours on business days.',
    },
    {
      question: 'Can I get a demo of ${projectName}?',
      answer:
        'Yes, you can request a demo by filling out the contact form on this page.',
    },
    {
      question: 'Is there a FAQ section available?',
      answer:
        'Yes, you can find answers to common questions in the FAQ section on this page.',
    },
    {
      question: 'How do I report a technical issue?',
      answer:
        'Please use the contact form to report any technical issues, and our support team will assist you.',
    },
    {
      question: 'Can I upgrade my plan through support?',
      answer:
        'Yes, our support team can help you upgrade your plan. Just reach out via the contact form.',
    },
  ];

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>{`Frequently Asked Questions - ${projectName}`}</title>
        <meta
          name='description'
          content={`Find answers to common questions about our Bitcoin-backed loan services. Learn more about how ${projectName} can help you.`}
        />
      </Head>
      <WebSiteHeader projectName={'bitcoin backed loan system'} pages={pages} />
      <main className={`flex-grow  ${bgColor}    rounded-none  `}>
        <HeroSection
          projectName={'bitcoin backed loan system'}
          image={['robot']}
          mainText={`Welcome to your ${projectName}`}
          subTitle={`This is React.js/Node.js app generated by the Flatlogic Web App Generator`}
          design={HeroDesigns.HORIZONTAL_WITH_BUTTONS || ''}
          buttonText={`Login`}
        />

        <FaqSection
          projectName={'bitcoin backed loan system'}
          design={FaqDesigns.TWO_COLUMN || ''}
          faqs={faqs}
          mainText={`Frequently Asked Questions `}
        />

        <ContactFormSection
          projectName={'bitcoin backed loan system'}
          design={ContactFormDesigns.SIMPLE_CLEAN || ''}
          image={['Contact Us']}
          mainText={`Contact Us `}
          subTitle={`Got a technical issue? Want to send feedback about a beta feature? Need details about our Business plan? Let us know.`}
        />
      </main>
      <WebSiteFooter projectName={'bitcoin backed loan system'} pages={pages} />
    </div>
  );
}

WebSite.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
