import { useState } from "react";
import { TransactionDashboard } from "../components/TransactionDashboard";
import { BookBindingTransactions } from "../components/BookBindingTransactions";
import { LaminationTransactions } from "../components/LaminationTransactions";
import Button from "../components/Button";
import { HeaderLoggedIn } from "../components/HeaderLoggedIn";
import { Footer } from "../components/Footer";

export const TransactionPage = () => {
  const [activeDashboard, setActiveDashboard] = useState("printing");

  return (
    <div className="transaction-page flex flex-col">
      <HeaderLoggedIn />
      <div className="transaction-content m-auto my-0 w-full max-w-[1200px]">
        <h1 className="mt-[5rem] mb-[5rem] text-center text-[clamp(1.5rem,3vw,3rem)] font-bold text-navy">
          Transaction <span className="text-yellow">Dashboard</span>
        </h1>

        {/* Buttons to toggle dashboards */}
        <div className="m-auto my-0 flex justify-between w-full max-w-[1000px]">
          <Button
            title="Printing Transaction"
            style="text-white bg-navy rounded-[100rem] w-full max-w-[20rem] py-[1rem] text-[clamp(1.2rem,3vw,1.2rem)] font-bold"
            onClick={() => setActiveDashboard("printing")}
          />
          <Button
            title="Book Binding Transaction"
            style="text-white bg-navy rounded-[100rem] w-full max-w-[20rem] py-[1rem] text-[clamp(1.2rem,3vw,1.2rem)] font-bold"
            onClick={() => setActiveDashboard("bookBinding")}
          />
          <Button
            title="Lamination Transaction"
            style="text-white bg-navy rounded-[100rem] w-full max-w-[20rem] py-[1rem] text-[clamp(1.2rem,3vw,1.2rem)] font-bold"
            onClick={() => setActiveDashboard("lamination")}
          />
        </div>

        {/* Conditional rendering of dashboards */}
        <div className="mt-[5rem]">
          {activeDashboard === "printing" && (
            <div className="printing-transaction-dashboard">
              <h1 className="text-center mb-[5rem] text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-navy">
                Printing Transaction Dashboard
              </h1>
              <TransactionDashboard />
            </div>
          )}

          {activeDashboard === "bookBinding" && (
            <div className="book-binding-transaction-dashboard">
              <h1 className="text-center mb-[5rem] text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-navy">
                Book Binding Transaction Dashboard
              </h1>
              <BookBindingTransactions />
            </div>
          )}

          {activeDashboard === "lamination" && (
            <div className="lamination-transaction-dashboard">
              <h1 className="text-center mb-[5rem] text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-navy">
                Lamination Transaction Dashboard
              </h1>
              <LaminationTransactions />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
