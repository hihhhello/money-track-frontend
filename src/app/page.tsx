import { range } from 'lodash';

import { PlusIcon } from '@/shared/ui/Icons/PlusIcon';
import {
  formatToUSDCurrency,
  formatToUSDCurrencyNoCents,
} from '@/shared/utils/helpers';
import { ChevronDownIcon } from '@/shared/ui/Icons/ChevronDownIcon';
import { ShoppingBagIcon } from '@/shared/ui/Icons/ShoppingBagIcon';
import { SuitcaseIcon } from '@/shared/ui/Icons/SuitcaseIcon';

const CurrentBalanceCard = () => {
  return (
    <div className="card flex flex-col gap-4 pb-6">
      <div className="flex justify-between">
        <div className="inline-block rounded-[40px] border border-main-dark px-6 py-1 text-center">
          <span className="text-2xl leading-9">Balance</span>
        </div>

        <div className="flex gap-1">
          <button className="flex w-[142px] justify-between rounded-[100px] bg-main-blue px-4 py-3 text-sm leading-6 text-white">
            <span>Together</span>

            <ChevronDownIcon className="stroke-white" />
          </button>

          <button className="flex w-[142px] justify-between rounded-[100px] bg-main-blue px-4 py-3 text-sm leading-6 text-white">
            <span>All sources</span>

            <ChevronDownIcon className="stroke-white" />
          </button>
        </div>
      </div>

      <span className="text-6xl text-black">
        {formatToUSDCurrencyNoCents(3800)}
      </span>
    </div>
  );
};

const IncomeCard = () => {
  return (
    <div className="card flex flex-1 flex-col items-center gap-4 pb-8">
      <div className="rounded-[40px] border border-main-dark px-6 py-1 text-center ">
        <span className="text-2xl leading-9">Income</span>
      </div>

      <span className="text-5xl leading-[72px]">
        +{formatToUSDCurrencyNoCents(4563)}
      </span>
    </div>
  );
};

const OutcomeCard = () => {
  return (
    <div className="card flex flex-1 flex-col items-center gap-4 pb-8">
      <div className="rounded-[40px] border border-main-dark px-6 py-1 text-center ">
        <span className="text-2xl leading-9">Expense</span>
      </div>

      <span className="text-5xl leading-[72px]">
        {formatToUSDCurrencyNoCents(-1246)}
      </span>
    </div>
  );
};

const UpcomingPaymentsCard = () => {
  return (
    <div className="card flex h-full flex-col">
      <div className="mb-6 flex justify-between">
        <div className="inline-block rounded-[40px] border border-main-dark px-6 py-1 text-center ">
          <span className="text-2xl leading-9">Upcoming payments</span>
        </div>

        <button className="rounded-[100px] bg-main-blue px-4 py-3 text-sm leading-6 text-white">
          See more
        </button>
      </div>

      <div className="overflow-y-auto pr-2">
        {range(0, 20).map((key) => (
          <div
            className="mb-2 flex justify-between rounded-2xl bg-white px-5 py-2"
            key={key}
          >
            <div className="flex gap-4">
              <div className="h-[49px] w-[54px] rounded-lg bg-slate-400"></div>

              <div>
                <span className="text-xl font-medium leading-7">Netflix</span>

                <div className="flex gap-2.5">
                  <span className="text-sm font-light leading-5">07.12.23</span>

                  <span className="text-sm font-light leading-5">12pm</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <span className="text-sm font-medium leading-5">
                {formatToUSDCurrencyNoCents(24)}
              </span>

              <span className="text-xs font-light leading-4">per month</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LastTransactionsCard = () => {
  return (
    <div className="card flex h-full flex-col">
      <div className="mb-6 flex justify-between">
        <div className="inline-block rounded-[40px] border border-main-dark px-6 py-1 text-center ">
          <span className="text-2xl leading-9">Last transactions</span>
        </div>

        <button className="rounded-[100px] bg-main-blue px-4 py-3 text-sm leading-6 text-white">
          See more
        </button>
      </div>

      <div className="overflow-y-auto pr-2">
        {range(0, 20).map((key) =>
          key % 2 === 0 ? (
            <div
              className="mb-2 flex items-center justify-between rounded-2xl bg-white px-5 py-2"
              key={key}
            >
              <div className="flex gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-center rounded-[4px] bg-main-blue px-2">
                    <span className="text-[10px] text-white">Expense</span>
                  </div>

                  <div className="flex h-[44px] w-[57px] items-center justify-center rounded-md ring-1 ring-main-blue">
                    <ShoppingBagIcon className="stroke-main-blue" />
                  </div>
                </div>

                <div>
                  <span className="text-xl font-medium leading-7">Jeans</span>

                  <div className="flex flex-col">
                    <span className="text-sm font-light leading-5">
                      BOA Debit Card
                    </span>

                    <span className="text-sm font-light leading-5">13:48</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <span className="text-xl font-medium leading-7">
                  {formatToUSDCurrency(-58.99)}
                </span>
              </div>
            </div>
          ) : (
            <div
              className="mb-2 flex items-center justify-between rounded-2xl bg-white px-5 py-2"
              key={key}
            >
              <div className="flex gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-center rounded-[4px] bg-main-orange px-2">
                    <span className="text-[10px] text-white">Income</span>
                  </div>

                  <div className="flex h-[44px] w-[57px] items-center justify-center rounded-md ring-1 ring-main-orange">
                    <SuitcaseIcon className="fill-main-orange" />
                  </div>
                </div>

                <div>
                  <span className="text-xl font-medium leading-7">Salary</span>

                  <div className="flex flex-col">
                    <span className="text-sm font-light leading-5">
                      BOA Debit Card
                    </span>

                    <span className="text-sm font-light leading-5">13:48</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <span className="text-xl font-medium leading-7">
                  +{formatToUSDCurrency(2348.99)}
                </span>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

const AnalyticsCard = () => {
  return (
    <div className="card flex flex-col gap-8 pb-14">
      <div className="flex justify-between">
        <div className="inline-block rounded-[40px] border border-main-dark px-6 py-1 text-center">
          <span className="text-2xl leading-9">Analytics</span>
        </div>

        <div className="flex gap-1">
          <button className="flex w-[142px] justify-between rounded-[100px] bg-main-blue px-4 py-3 text-sm leading-6 text-white">
            <span>Together</span>

            <ChevronDownIcon className="stroke-white" />
          </button>

          <button className="flex w-[142px] justify-between rounded-[100px] bg-main-blue px-4 py-3 text-sm leading-6 text-white">
            <span>Today</span>

            <ChevronDownIcon className="stroke-white" />
          </button>
        </div>
      </div>

      <div className="flex gap-5">
        <div className="h-[289px] w-[289px] bg-slate-500"></div>

        <div className="flex flex-1 flex-col gap-4">
          <div className="flex justify-between rounded-[40px] bg-white px-2 py-1">
            <div className="h-5 w-5 rounded-full bg-[#EE8058]"></div>

            <span className="text-sm leading-5">Groceries</span>

            <span className="text-sm font-medium leading-5">23%</span>

            <span className="text-sm font-semibold leading-5">
              {formatToUSDCurrencyNoCents(234)}
            </span>
          </div>

          <div className="flex justify-between rounded-[40px] bg-white px-2 py-1">
            <div className="h-5 w-5 rounded-full bg-[#EFDF53]"></div>

            <span className="text-sm leading-5">Restaurants</span>

            <span className="text-sm font-medium leading-5">23%</span>

            <span className="text-sm font-semibold leading-5">
              {formatToUSDCurrencyNoCents(234)}
            </span>
          </div>

          <div className="flex justify-between rounded-[40px] bg-white px-2 py-1">
            <div className="h-5 w-5 rounded-full bg-[#A0CF3C]"></div>

            <span className="text-sm leading-5">Housing</span>

            <span className="text-sm font-medium leading-5">23%</span>

            <span className="text-sm font-semibold leading-5">
              {formatToUSDCurrencyNoCents(234)}
            </span>
          </div>

          <div className="flex justify-between rounded-[40px] bg-white px-2 py-1">
            <div className="h-5 w-5 rounded-full bg-[#F881D6]"></div>

            <span className="text-sm leading-5">Transportation</span>

            <span className="text-sm font-medium leading-5">23%</span>

            <span className="text-sm font-semibold leading-5">
              {formatToUSDCurrencyNoCents(234)}
            </span>
          </div>

          <div className="flex justify-between rounded-[40px] bg-white px-2 py-1">
            <div className="h-5 w-5 rounded-full bg-[#CF4EFC]"></div>

            <span className="text-sm leading-5">Healthcare</span>

            <span className="text-sm font-medium leading-5">23%</span>

            <span className="text-sm font-semibold leading-5">
              {formatToUSDCurrencyNoCents(234)}
            </span>
          </div>

          <div className="flex justify-between rounded-[40px] bg-white px-2 py-1">
            <div className="h-5 w-5 rounded-full bg-[#3CB5CF]"></div>

            <span className="text-sm leading-5">Clothing</span>

            <span className="text-sm font-medium leading-5">23%</span>

            <span className="text-sm font-semibold leading-5">
              {formatToUSDCurrencyNoCents(234)}
            </span>
          </div>

          <div className="flex justify-between rounded-[40px] bg-white px-2 py-1">
            <div className="h-5 w-5 rounded-full bg-[#3C54CF]"></div>

            <span className="text-sm leading-5">Other</span>

            <span className="text-sm font-medium leading-5">23%</span>

            <span className="text-sm font-semibold leading-5">
              {formatToUSDCurrencyNoCents(234)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="grid sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-4 sm:gap-y-3">
      <div className="sm:col-span-1 sm:row-start-1">
        <div className="mb-4">
          <CurrentBalanceCard />
        </div>

        <div className="mb-4 flex gap-5">
          <IncomeCard />

          <OutcomeCard />
        </div>

        <div>
          <button className="flex w-full items-center justify-center gap-3 rounded-[100px] bg-main-blue py-4">
            <span className="leading-6 text-white">Add new transactions</span>

            <PlusIcon />
          </button>
        </div>
      </div>

      <div className="sm:col-span-1 sm:row-start-2">
        <AnalyticsCard />
      </div>

      <div className="h-[453px] sm:col-span-1 sm:row-start-1">
        <UpcomingPaymentsCard />
      </div>

      <div className="h-[453px] sm:col-span-1 sm:row-start-2">
        <LastTransactionsCard />
      </div>
    </div>
  );
};

export default HomePage;
