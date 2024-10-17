import React, { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAppSelector } from '../stores/hooks';
import LayoutGuest from '../layouts/Guest';
import WebSiteHeader from '../components/WebPageComponents/Header';
import WebSiteFooter from '../components/WebPageComponents/Footer';
import {
  HeroDesigns,
  AboutUsDesigns,
  ContactFormDesigns,
  FeaturesDesigns,
  FaqDesigns,
  PricingDesigns,
} from '../components/WebPageComponents/designs';

import HeroSection from '../components/WebPageComponents/HeroComponent';

import AboutUsSection from '../components/WebPageComponents/AboutUsComponent';

import ContactFormSection from '../components/WebPageComponents/ContactFormComponent';

import FeaturesSection from '../components/WebPageComponents/FeaturesComponent';

import FaqSection from '../components/WebPageComponents/FaqComponent';

import PricingSection from '../components/WebPageComponents/PricingComponent';

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

  const features_points = [
    {
      name: 'Secure Bitcoin Wallet',
      description:
        "Keep your Bitcoin safe with our secure virtual wallet. Transfer your Bitcoin with confidence, knowing it's protected against unauthorized access.",
      icon: 'mdiLock',
    },
    {
      name: 'Instant Loan Calculator',
      description:
        'Quickly calculate your eligible loan amount based on the current Bitcoin value. Get instant insights to make informed borrowing decisions.',
      icon: 'mdiCalculator',
    },
    {
      name: 'Easy Loan Management',
      description:
        'Manage your loan applications and repayments effortlessly. Track your loan status, repayment schedule, and more with our user-friendly interface.',
      icon: 'mdiClipboardCheck',
    },
  ];

  const faqs = [
    {
      question: 'How does the Bitcoin-backed loan process work?',
      answer:
        'To get a loan, you transfer your Bitcoin to a secure virtual wallet. The loan amount is calculated based on the current Bitcoin value, and you receive funds in your bank account. If you fail to repay, the Bitcoin can be sold to recover the loan.',
    },
    {
      question: "What happens if I can't repay my loan on time?",
      answer:
        "If you cannot repay your loan by the due date, the lender has the right to sell your Bitcoin collateral to recover the loan amount. It's important to manage your repayments to avoid this situation.",
    },
    {
      question: 'Is my Bitcoin safe with ${projectName}?',
      answer:
        'Yes, your Bitcoin is stored in a secure virtual wallet with advanced security measures to protect against unauthorized access. We prioritize the safety of your assets.',
    },
    {
      question: 'Can I apply for a loan without transferring my Bitcoin?',
      answer:
        'No, transferring your Bitcoin to the virtual wallet is necessary to use it as collateral for the loan. This ensures the lender has security in case of non-repayment.',
    },
    {
      question: 'What are the interest rates for the loans?',
      answer:
        'Interest rates vary based on the loan amount and terms. You can use our loan calculator to estimate the interest rate for your specific loan scenario.',
    },
    {
      question: 'How long does it take to get approved for a loan?',
      answer:
        'Loan approval times can vary, but typically, you can expect a decision within 24 to 48 hours after submitting your application and transferring your Bitcoin.',
    },
    {
      question: 'Can I repay my loan early?',
      answer:
        'Yes, you can repay your loan early without any penalties. Early repayment can help you save on interest costs.',
    },
  ];

  const pricing_features = {
    standard: {
      features: ['Secure Bitcoin Wallet', 'Instant Loan Calculator'],
      limited_features: ['Basic Loan Management', 'Standard Support'],
    },
    premium: {
      features: [
        'Secure Bitcoin Wallet',
        'Instant Loan Calculator',
        'Advanced Loan Management',
      ],
      also_included: ['Priority Support', 'Enhanced Security Features'],
    },
    business: {
      features: [
        'Secure Bitcoin Wallet',
        'Instant Loan Calculator',
        'Comprehensive Loan Management',
        'Dedicated Account Manager',
        'Customizable Loan Terms',
      ],
    },
  };

  const description = {
    standard:
      'Ideal for individuals looking to leverage their Bitcoin for personal loans with essential features.',
    premium:
      'Perfect for small startups or agencies needing advanced loan management and priority support.',
    business:
      'Designed for enterprises requiring comprehensive loan solutions with dedicated support and customization.',
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>{`Bitcoin-Backed Loan System - Secure and Efficient`}</title>
        <meta
          name='description'
          content={`Explore our Bitcoin-backed loan system, offering secure and efficient loan services with competitive rates. Learn more about our features, pricing, and how to get started.`}
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

        <AboutUsSection
          projectName={'bitcoin backed loan system'}
          image={['Team collaborating on financial solutions']}
          mainText={`Empowering Financial Freedom with Innovation`}
          subTitle={`At our core, we are dedicated to revolutionizing the financial landscape with our Bitcoin-backed loan system. Our mission is to provide secure, efficient, and accessible financial solutions for everyone.`}
          design={AboutUsDesigns.IMAGE_LEFT || ''}
          buttonText={`Learn More About Us`}
        />

        <FeaturesSection
          projectName={'bitcoin backed loan system'}
          image={['Bitcoin loan features overview']}
          withBg={1}
          features={features_points}
          mainText={`Explore Key Features of ${projectName}`}
          subTitle={`Discover how ${projectName} empowers you with secure and efficient Bitcoin-backed loans. Our features are designed to provide value and peace of mind.`}
          design={FeaturesDesigns.CARDS_GRID_WITH_ICONS || ''}
        />

        <FaqSection
          projectName={'bitcoin backed loan system'}
          design={FaqDesigns.ACCORDION || ''}
          faqs={faqs}
          mainText={`Frequently Asked Questions about ${projectName} `}
        />

        <PricingSection
          projectName={'bitcoin backed loan system'}
          withBg={1}
          features={pricing_features}
          description={description}
        />

        <ContactFormSection
          projectName={'bitcoin backed loan system'}
          design={ContactFormDesigns.WITH_IMAGE || ''}
          image={['Person typing on a laptop']}
          mainText={`Get in Touch with Us `}
          subTitle={`Have questions or need assistance with our Bitcoin-backed loan system? Contact us anytime, and we'll respond promptly to address your needs.`}
        />
      </main>
      <WebSiteFooter projectName={'bitcoin backed loan system'} pages={pages} />
    </div>
  );
}

WebSite.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
