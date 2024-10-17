import React from 'react';
import Link from 'next/link';
import BaseButton from '../BaseButton';
import { humanize } from '../../helpers/humanize';
import { useRouter } from 'next/router';
import { useAppSelector } from '../../stores/hooks';
import { HeaderStyle } from './designs';
import { HeaderDesigns } from './designs';

interface WebSiteHeaderProps {
  projectName: string;
  pages: any;
}
export default function WebSiteHeader({
  projectName,
  pages,
}: WebSiteHeaderProps) {
  const router = useRouter();
  const websiteHeder = useAppSelector((state) => state.style.websiteHeder);
  const borders = useAppSelector((state) => state.style.borders);

  const style = HeaderStyle.PAGES_RIGHT;

  const design = HeaderDesigns.DESIGN_DIVERSITY;
  return (
    <header className='overflow-hidden'>
      <div
        className={` ${
          design ? websiteHeder : 'bg-midnightBlueTheme-diversityHeader'
        }  rounded-none py-4 px-6`}
      >
        <div className='lg:ml-16 mx-auto'>
          <div
            className={`${
              design ? '' : ' text-white  '
            } flex flex-col md:flex-row justify-between items-center`}
          >
            <div
              className={`flex flex-col md:flex-row items-center  w-full ${
                style ? 'md:w-auto' : 'justify-between mr-6'
              } `}
            >
              <div className='font-bold py-2 lg:mr-6 text-center md:text-left'>
                {projectName}
              </div>
              <div className='py-6 md:py-0 flex flex-col md:flex-row w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4'>
                {pages.map((page, index) => {
                  const isRootRoute = router.pathname === '/';
                  const isActive = isRootRoute
                    ? index === 0
                    : router.pathname.includes(page.href);

                  return (
                    <Link
                      key={index}
                      href={page.href}
                      className={`block text-sm text-center ${
                        isActive ? `border-b-2 ${borders}` : ''
                      }`}
                    >
                      {humanize(page.label)}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className='flex justify-center  md:justify-start w-full md:w-auto mt-4 md:mt-0'>
              <BaseButton
                href='/login'
                label='Login'
                color={`${design ? 'info' : 'white'}`}
                className='text-midnightBlueTheme-buttonColor   px-6 py-2 '
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
