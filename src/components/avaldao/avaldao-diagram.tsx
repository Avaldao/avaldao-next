

import { FC } from "react";
import Image from "next/image";

const AvalDaoDiagram: FC = () => {
  return (
    <div className="flex flex-col max-w-6xl mx-auto pb-10 pt-10 md:pt-0 w-full bg-white px-6 rounded-lg">

      <div className=" flex flex-col gap-y-6 items-center md:grid md:grid-cols-[1fr_200_1fr] md:grid-rows-3 place-items-center">

        <div className="col-start-2 row-start-2 ">
          <div className="relative flex flex-col items-center max-w-5xl">
            {/* Central circle */}
            <div className="relative w-50 h-50 md:w-55 md:h-55 ">
              <div className="absolute inset-0 rounded-full p-1 bg-linear-to-r from-[#6246ea] to-[#00c6cf]">
                <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center ">
                  <Image
                    src="/images/avaldao.svg" // reemplaza con tu logo
                    alt="AvalDAO logo"
                    width={160}
                    height={160}
                    className="object-contain mb-4"
                  />

                </div>
              </div>
            </div>

          </div>
        </div>


        <div className="col-start-1 row-start-2 md:self-start flex flex-col items-center md:items-start space-y-3 md:pr-10 justify-self-end-safe">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#D8F4F0]">
              <Image
                src="/images/d-investor.png"
                alt="Investors"
                width={48}
                height={48}
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Investors</h3>
          </div>
          <p className="text-gray-600 text-md  max-w-md md:max-w-xs  text-justify min-h-15">
            Contribute crypto capital to the Guarantee Fund to provide social
            growth and economic sustainability.
          </p>
        </div>


        <div className="col-start-2 row-start-3 pt-4 col-span-2 justify-self-start md:pl-20">
          <div className="flex flex-col items-center md:items-start space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#D8F4F0]">
                <Image src="/images/d-pymes.png" alt="SMEs" width={48} height={48} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">SMEs</h3>
            </div>
            <p className="text-gray-600 text-md  max-w-md md:max-w-xs  text-justify min-h-15">
              Build their reputation on their digital identity through
              credentials granted by issuers that accredit aspects such as
              responsibility, knowledge, and productivity, among others.
            </p>
          </div>
        </div>

        <div className="row-start-1 col-start-3 md:self-end md:justify-self-start ">
          <div className="flex flex-col items-center md:items-start space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#D8F4F0]">
                <Image src="/images/d-commerce.png" alt="Shops" width={48} height={48} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Shops</h3>
            </div>
            <p className="text-gray-600 text-md  max-w-md md:max-w-xs  text-justify min-h-15">
              Offer their goods and services with special credit conditions to
              those who have guarantees approved by AvalDAO.
            </p>
          </div>
        </div>



      </div>
      <div className="mt-12 text-center md:pt-6">
        <h4 className="text-2xl font-semibold text-[#6246ea]">
          In You <span className="text-[#00c6cf]">We Trust</span>
        </h4>
        <div className="h-[2px] w-16 bg-[#00c6cf] mx-auto mt-2"></div>
      </div>

    </div>
  );
};

export default AvalDaoDiagram;
