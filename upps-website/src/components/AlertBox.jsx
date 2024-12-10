import Button from "./Button";
import alert from "../assets/checkAlert.png";
export const AlertBox = ({ alertHeader, alertContent }) => {
  return (
    <div className="alert-box flex flex-col items-center justify-center h-[100vh]">
      <div className="alert-box-content bg-white flex flex-col gap-[5rem] justify-between m-auto my-0 w-full max-w-[45rem] rounded-[10px] p-[3rem] shadow-[0px_4px_20px_rgba(0,0,0,0.25)]">
        <div className="flex gap-5">
          <div className="alert-image h-[fit-content] w-[20rem] rounded-[100%]">
            <img src={alert} alt="" />
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-[clamp(1.5rem,3vw,1.8rem)] font-bold text-navy">
              {alertHeader}Account Pending Request
            </h1>
            <p>
              {alertContent}
              Your account needs to be reviewed by the chairman first. Please
              wait for the chairman's approval. You will be notified via email
              once the status of your account has been determined. Thank you.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            title={"Cancel"}
            style={
              "bg-red-500 text-white w-full max-w-[7rem] py-[0.5rem] rounded-[5px] font-bold"
            }
          ></Button>
          <Button
            title={"Ok"}
            style={
              "bg-navy text-white w-full max-w-[7rem] py-[0.5rem] rounded-[5px] font-bold"
            }
          ></Button>
        </div>
      </div>
    </div>
  );
};
