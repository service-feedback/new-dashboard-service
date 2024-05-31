import React, {   } from 'react';
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import PieChartCard from "views/admin/default/components/PieChartCard";
import PieChartCard2 from "views/admin/default/components/pieChartChard2";
import { columnsDataCheck } from "./variables/columnsData";
import Widget from "components/widget/Widget";
import CheckTable from "views/admin/default/components/CheckTable";
import tableDataCheck from "./variables/tableDataCheck.json";
import { IoHappyOutline } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import { PiSmileyMeh } from "react-icons/pi";
import { TfiFaceSad } from "react-icons/tfi";
import { LiaAngry } from "react-icons/lia";
import { axioscall } from 'variables/charts';

console.log( "countsOfEmojis  "+axioscall.data.countsOfEmojis)
const Dashboard = () => {
  // const [emojiData, setEmojiData] = useState([]);

  return (
    <div>
      {/* Card widget */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-5">
        <Widget
          icon={<IoHappyOutline className="h-8 w-8" />}
          title={"Excellent"}
          subtitle={axioscall.data.countsOfEmojis[0]}
        />
        <Widget
          icon={<BsEmojiSmile className="h-7 w-7" />}
          title={"Very Good"}
          subtitle={axioscall.data.countsOfEmojis[1]}
        />
        <Widget
          icon={<PiSmileyMeh className="h-8 w-8" />}
          title={"Good"}
          subtitle={axioscall.data.countsOfEmojis[2]}
        />
        <Widget
          icon={<TfiFaceSad className="h-7 w-7" />}
          title={"Average"}
          subtitle={axioscall.data.countsOfEmojis[3]}
        />
        <Widget
          icon={<LiaAngry className="h-9 w-9" />}
          title={"Poor"}
          subtitle={axioscall.data.countsOfEmojis[4]}
        />
      </div>

      {/* Charts */}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent />
        <WeeklyRevenue />
      </div>

      {/* Tables & Charts */}
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Check Table */}
        <div>
          <CheckTable
            columnsData={columnsDataCheck}
            tableData={tableDataCheck}
          />
        </div>

        {/* Traffic chart & Pie Chart */}
        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <PieChartCard2 />
          <PieChartCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
