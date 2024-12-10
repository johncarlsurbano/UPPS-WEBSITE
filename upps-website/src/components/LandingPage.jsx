// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OfficeHeadProfile from "../assets/OfficeHeadProfile.png";
import { Footer } from "./Footer";
import { useNavigate } from "react-router-dom";
import { HeaderNotLoggedIn } from "./HeaderNotLoggedIn";
import { StudentDashboard } from "./StudentDashboard";
import { useSelector } from "react-redux"

export const LandingPage = () => {




  const navigate = useNavigate();
  return (
    <div className="landing-page flex flex-col">
      <HeaderNotLoggedIn  href={"#aboutus"}/>
      <StudentDashboard />
      {/* =================================== */}
      <div id="aboutus">
      <div className="about flex mt-[10rem] mb-[10rem]" >
        <div className="about-content flex flex-col items-center gap-8 text-center mx-auto w-full max-w-[1200px]">
          <h1 className="text-center mt-[5rem] text-[clamp(1.5rem,3vw,2.5rem)] text-navy font-bold">
            What is <span className="text-yellow">UPPS?</span>
          </h1>
          <p className="w-full max-w-[1000px]">
            Lorem Ipsum has been the industry's standard dummy text ever since
            the 1500s. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s. Lorem Ipsum has been the industry's standard
            dummy text ever since the 1500s. Lorem Ipsum has been the industry's
            standard dummy text ever since the 1500s. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s. Lorem Ipsum has
            been the industry's standard dummy text ever since the 1500s.
          </p>
        </div>
      </div>

      <div className="schedule flex">
        <div className="schedule-content flex justify-between w-full max-w-[1200px] mx-auto">
          <div className="office-head flex flex-col gap-8 w-full max-w-[50%]">
            <h1 className="w-full max-w-[40rem] text-navy text-[clamp(1.5rem,3vw,2.5rem)] font-bold">
              UPPS - University Printing Press System
            </h1>
            <div className="card flex flex-col gap-12 px-[2rem] py-[2rem]">
              <div className="card-profile flex items-center gap-8 w-full max-w-[30rem]">
                <div className="card-profile-image w-32 h-32 overflow-hidden rounded-full border-4 border-[#f4b213]">
                  <img
                    src={OfficeHeadProfile}
                    alt="Office Head Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="card-profile-information">
                  <h1 className="text-[clamp(1.5rem,3vw,1.5rem)] font-bold text-navy">
                    Mrs. Lorem Ipsum
                  </h1>
                  <p className="text-[clamp(1rem,3vw,1rem)] font-bold text-yellow">
                    Office Head
                  </p>
                </div>
              </div>
              <p>
                Lorem Ipsum has been the industry's standard dummy text ever
                since the 1500s. Lorem Ipsum has been the industry's standard
                dummy text ever since the 1500s. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s. Lorem Ipsum
                has been the industry's standard dummy text ever since the
                1500s. Lorem Ipsum has been the industry's standard dummy text
                ever since the 1500s. Lorem Ipsum has been the industry's
                standard dummy text ever since the 1500s.
              </p>
            </div>
          </div>
          <div className="weekly-time-table flex flex-col gap-4 w-full max-w-[30%] bg-white p-8 shadow-lg">
            <h1 className="text-[clamp(1.5rem,3vw,1.5rem)] text-navy font-bold">
              Weekly Timetable
            </h1>
            <div className="weekly-time-table-schedule flex flex-col gap-4 min-h-[400px]">
              <h4 className="flex justify-between py-4 border-b border-black font-bold">
                Monday<span className="font-normal">10:00am - 5:00pm</span>
              </h4>
              <h4 className="flex justify-between py-4 border-b border-black font-bold">
                Tuesday<span className="font-normal">10:00am - 5:00pm</span>
              </h4>
              <h4 className="flex justify-between py-4 border-b border-black font-bold">
                Wednesday<span className="font-normal">10:00am - 5:00pm</span>
              </h4>
              <h4 className="flex justify-between py-4 border-b border-black font-bold">
                Thursday<span className="font-normal">10:00am - 5:00pm</span>
              </h4>
              <h4 className="flex justify-between py-4 font-bold">
                Friday<span className="font-normal">10:00am - 5:00pm</span>
              </h4>
            </div>
          </div>
        </div>
      </div>
      <div className="services mt-[10rem] mb-[10rem] flex">
        <div className="services-content flex flex-col text-center w-full max-w-[1200px] mx-auto gap-20">
          <h1 className="text-center mt-[5rem] text-[clamp(1.5rem,3vw,2.5rem)] text-navy font-bold">
            Service <span className="text-yellow">Offered</span>
          </h1>
          <div className="printing-services flex flex-col gap-8 self-start text-left w-full max-w-[600px]">
            <h1 className="mt-[5rem] text-[clamp(1.5rem,3vw,2.5rem)] text-navy font-bold">
              Printing
            </h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatibus voluptate reiciendis harum aperiam ratione labore
              magni dolor perferendis, repellendus cum impedit? Distinctio harum
              nesciunt corporis ipsum mollitia, quidem repellat quis explicabo
              ad dolor culpa debitis architecto quisquam consectetur nisi.
              Laudantium, asperiores ipsa. Veritatis dolor, accusamus repellat
              laborum beatae autem, saepe molestiae nesciunt laudantium magnam
              aperiam at sint. Porro voluptatum magnam quod voluptas expedita
              odio maxime aliquid tempore recusandae commodi quo tempora
              temporibus quas laboriosam tenetur consequuntur amet facilis
              minus, dolorum ipsa! Eveniet, dignissimos ullam hic iusto ad
              voluptates laborum quisquam deserunt magnam ipsam nam, molestias
              debitis illum quis voluptatibus? Vero.
            </p>
          </div>
          <div className="book-binding-services flex flex-col gap-8 self-end text-right w-full max-w-[600px]">
            <h1 className="mt-[5rem] text-[clamp(1.5rem,3vw,2.5rem)] text-navy font-bold">
              Book Binding
            </h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Laboriosam quis quisquam maiores adipisci consequuntur natus,
              omnis mollitia nulla temporibus, eius repellat, minus nisi
              nesciunt magni atque blanditiis architecto doloremque molestias
              placeat in culpa? In numquam sapiente quam ipsa sit culpa, magnam
              sint dolores nam laboriosam. Amet, libero mollitia possimus
              cupiditate deserunt rerum eligendi esse enim, maxime laboriosam
              incidunt quod fugiat id consequatur impedit ad quas modi animi
              accusantium. Iusto, consequatur?
            </p>
          </div>
          <div className="lamination-services flex flex-col gap-8 self-start text-left w-full max-w-[600px]">
            <h1 className="mt-[5rem] text-[clamp(1.5rem,3vw,2.5rem)] text-navy font-bold">
              Lamination
            </h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas
              placeat aperiam in atque veniam! Id reiciendis eligendi alias rem
              animi, consequuntur exercitationem! Corrupti soluta fugiat id
              sapiente autem quae eos numquam. Numquam assumenda molestias sunt
              velit? Quos vel, ipsum eaque enim esse dolorem illo asperiores
              expedita rerum optio quam voluptates explicabo. Doloribus eos,
              quasi inventore excepturi ipsum dicta expedita rem aliquid ea
              praesentium obcaecati, commodi adipisci tempore facilis eligendi
              similique repellat quas aperiam quam explicabo placeat atque
              minus? Aspernatur, delectus.
            </p>
          </div>
        </div>
      </div>
      </div>
      <Footer></Footer>
    </div>
  );
};
