// import PieChart from "components/charts/PieChart";
// import { pieChartData2,  pieChartOptions2 } from "variables/charts";
// import Card from "components/card";

// const PieChartCard2 = () => {
//   return (
//     <Card extra="rounded-[20px] p-3">
//       <div className="flex flex-row justify-between px-3 pt-2">
//         <div>
//           <h4 className="text-lg font-bold text-navy-700 dark:text-white">
//             Customer Satisfaction
//           </h4>
//         </div>

//         {/* <div className="mb-6 flex items-center justify-center">
//           <select className="mb-3 mr-2 flex items-center justify-center text-sm font-bold text-gray-600 hover:cursor-pointer dark:!bg-navy-800 dark:text-white">
//             <option value="monthly">Monthly</option>
//             <option value="yearly">Yearly</option>
//             <option value="weekly">Weekly</option>
//           </select>
//         </div> */}
//       </div>

//       <div className="mb-auto flex h-[220px] w-full items-center justify-center">
//         <PieChart options={pieChartOptions2} series={pieChartData2} />
//       </div>
//       <div className="flex flex-row !justify-between rounded-2xl px-6 py-3 shadow-2xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
//         <div className="flex flex-col items-center justify-center">
//           <div className="flex items-center justify-center">
//             <div className="h-2 w-2 rounded-full bg-brand-500" />
//             <p className="ml-1 text-sm font-normal text-gray-600">Good</p>
//           </div>
//           <p className="mt-px text-xl font-bold text-navy-700  dark:text-white">
//           {pieChartData2[0]}%
//           </p>
//         </div>

//         <div className="h-11 w-px bg-gray-300 dark:bg-white/10" />

//         <div className="flex flex-col items-center justify-center">
//           <div className="flex items-center justify-center">
//             <div className="h-2 w-2 rounded-full bg-[#6AD2FF]" />
//             <p className="ml-1 text-sm font-normal text-gray-600">Average</p>
//           </div>
//           <p className="mt-px text-xl font-bold text-navy-700 dark:text-white">
//           {pieChartData2[1]}%
//           </p>
//         </div>
//         <div className="h-11 w-px bg-gray-300 dark:bg-white/10" />
//         <div className="flex flex-col items-center justify-center">
//           <div className="flex items-center justify-center">
//             <div className="h-2 w-2 rounded-full bg-[#fbdb5c]" />
//             <p className="ml-1 text-sm font-normal text-gray-600"> Poor</p>
//           </div>
//           <p className="mt-px text-xl font-bold text-navy-700  dark:text-white">
//           {pieChartData2[2]}%
//           </p>
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default PieChartCard2;

// FunnelChartCard2.js
// views/admin/default/components/FunnelChartCard2.js

import React from "react";
import { ResponsiveFunnel } from "@nivo/funnel";
import Card from "components/card";
import { pieChartData2 } from "variables/charts";
// Define the data source for the funnel chart
const dataSource = [
  { id: "Good", value: pieChartData2[0] },
  { id: "Average", value: pieChartData2[1] },
  { id: "Poor", value: pieChartData2[2 ] }
];

const FunnelChartCard2 = () => {
  // console.log(pieChartData2)
  return (
    <Card extra="rounded-[20px] p-3">
      <div className="mb-4 flex flex-row justify-between px-3 pt-2">
        <div>
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
          Customer Satisfaction
          </h4>
        </div>
      </div>

      <div className="h-[250px] mb-auto flex justify-center items-center mr-9">
        <ResponsiveFunnel
          data={dataSource}
          margin={{ top: 20, right: 150, bottom: 20, left: 10 }}
          valueFormat=">-.4s"
          colors={d => getColor(d.id)} // Dynamic color assignment
          borderWidth={20}
          labelColor={{
            from: "color",
            modifiers: [["darker", 3]],
          }}
          beforeSeparatorLength={50}
          beforeSeparatorOffset={20}
          afterSeparatorLength={100}
          afterSeparatorOffset={20}
          currentPartSizeExtension={10}
          currentBorderWidth={20}
          motionConfig="wobbly"
          width={520} // Specify the desired width here
          shapeBlending={0.15} // Adjust shape blending to keep the funnel shape
        />
      </div>

      <div className="flex flex-row justify-between rounded-2xl px-6 py-3 shadow-2xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
        {dataSource.map((data, index) => (
          <div key={index} className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: getColor(data.id) }}
              />
              <p className="ml-1 text-sm font-normal text-gray-600">{data.id}</p>
            </div>
            <p className="mt-px text-xl font-bold text-navy-700 dark:text-white">
              {data.value}%
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Function to get color based on the id
const getColor = (id) => {
  switch (id) {
    case "Good":
      return "#552FFF";
    case "Average":
      return "#5fbde5";
    case "Poor":
      return "#fbdb5c";
    default:
      return "#888"; // Fallback color
  }
};

export default FunnelChartCard2;


// export default FunnelChartCard2;
