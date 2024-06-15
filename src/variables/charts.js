import axios from "axios";


let TotalFeedbackscount = null;
let monthly_Feedback_Counts_LinearChart = null;
let monthly_User_Counts_LinearChart =null
let recommendation_Counts_bar_chart = null;
let satisfactionPieChart = null;
let recommendationPieChart = null;

export const fetchData = async (filterOption) => {
  
  try {
    console.log("Filter option:", filterOption); // Log the filter option value
    const filter =   "Last 3 Month";

    const response = await axios.post(
      "https://feedback-git-main-feedback-services-projects.vercel.app/feedbackStatistics",
      { filter: filter },
      // Uncomment and use the headers if needed
      // headers: { Authorization: `Bearer ${token}` },
    );

    const responseData = response.data;
    console.log("Full Response Data:", responseData);

    // if (responseData && responseData.data) {
      console.log(responseData.data.totalFeedbacks);

      TotalFeedbackscount = responseData.data.totalFeedbacks;
      monthly_Feedback_Counts_LinearChart = responseData.data.monthly_Feedback_Counts_LinearChart;
      recommendation_Counts_bar_chart = responseData.data.recommendation_Counts_bar_chart;
      satisfactionPieChart = responseData.data.satisfactionPieChart;
      recommendationPieChart = responseData.data.recommendationPieChart;
      monthly_User_Counts_LinearChart = responseData.data.monthly_User_Counts_LinearChart

    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === "jwt expired"
    ) {
      window.location.href ="/login";
    } else {
      console.error("Error fetching data:", error);
      
    }
    
  }
};

export const axioscall =  await fetchData()


console.log("satisfactionPieChart "+satisfactionPieChart)

// Top-level static exports
export const barChartDataDailyTraffic = [
  {
    name: "Daily Traffic",
    data: [20, 30, 40, 20, 45, 50, 30],
  },
];

export const barChartOptionsDailyTraffic = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    style: {
      fontSize: "12px",
      fontFamily: undefined,
      backgroundColor: "#000000",
    },
    onDatasetHover: {
      style: {
        fontSize: "12px",
        fontFamily: undefined,
      },
    },
    theme: "dark",
  },
  xaxis: {
    categories: ["00", "04", "08", "12", "14", "16", "18"],
    show: false,
    labels: {
      show: true,
      style: {
        colors: "#A3AED0",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
    color: "black",
    labels: {
      show: true,
      style: {
        colors: "#CBD5E0",
        fontSize: "14px",
      },
    },
  },
  grid: {
    show: false,
    strokeDashArray: 5,
    yaxis: {
      lines: {
        show: true,
      },
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      type: "vertical",
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      colorStops: [
        [
          {
            offset: 0,
            color: "#4318FF",
            opacity: 1,
          },
          {
            offset: 100,
            color: "rgba(67, 24, 255, 1)",
            opacity: 0.28,
          },
        ],
      ],
    },
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      columnWidth: "40px",
    },
  },
};

// Continue with other static data and configurations

export const pieChartData = recommendationPieChart;
export const pieChartOptions = {
  labels: ["Good", "Average", "Poor"],
  colors: ["#4318FF", "#6AD2FF", "#fbdb5c"],
  chart: {
    width: "50px",
  },
  states: {
    hover: {
      filter: {
        type: "none",
      },
    },
  },
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  hover: { mode: null },
  plotOptions: {
    donut: {
      expandOnClick: false,
      donut: {
        labels: {
          show: false,
        },
      },
    },
  },
  fill: {
    colors: ["#4318FF", "#6AD2FF", "#fbdb5c"],
  },
  tooltip: {
    enabled: true,
    theme: "dark",
    style: {
      fontSize: "12px",
      fontFamily: undefined,
      backgroundColor: "#000000",
    },
  },
};

export const pieChartData2 = satisfactionPieChart;
export const pieChartOptions2 = {
  labels: ["Excellent, Very Good, Good", "Average", "Poor"],
  colors: ["#552FFF", "#5fbde5", "#fbdb5c"],
  chart: {
    width: "50px",
  },
  states: {
    hover: {
      filter: {
        type: "none",
      },
    },
  },
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  hover: { mode: null },
  plotOptions: {
    donut: {
      expandOnClick: false,
      donut: {
        labels: {
          show: false,
        },
      },
    },
  },
  fill: {
    colors: ["#4318FF", "#6AD2FF", "#fbdb5c"],
  },
  tooltip: {
    enabled: true,
    theme: "dark",
    style: {
      fontSize: "12px",
      fontFamily: undefined,
      backgroundColor: "#000000",
      color: "#000000",
    },
    marker: {
      show: true,
    },
    x: {
      show: true,
      style: {
        color: "#000000",
        fontSize: "12px",
      },
    },
    y: {
      formatter: (val) => `${val}`,
      title: {
        formatter: (seriesName) => seriesName,
        style: {
          color: "#000000",
          fontSize: "12px",
        },
      },
    },
  },
};

// Use a placeholder for EmojiData until data is fetched
export let EmojiData = [];
export const TotalFeedbacks = TotalFeedbackscount;

export const lineChartDataTotalSpent = [
  {
    name: "Feedbacks",
    data: monthly_Feedback_Counts_LinearChart.values,
    color: "#4318FF",
  },
  {
    name: "Customer Data",
    data: monthly_User_Counts_LinearChart.values ,
    color: "#6AD2FF",
  },
];

export const lineChartOptionsTotalSpent = {
  legend: {
    show: false,
  },
  theme: {
    mode: "light",
  },
  chart: {
    type: "line",
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  tooltip: {
    style: {
      fontSize: "12px",
      fontFamily: undefined,
      backgroundColor: "#000000",
    },
    theme: "dark",
    x: {
      format: "dd/MM/yy HH:mm",
    },
  },
  grid: {
    show: false,
  },
  xaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        colors: "#A3AED0",
        fontSize: "12px",
        fontWeight: "500",
      },
    },
    type: "text",
    range: undefined,
    categories: monthly_Feedback_Counts_LinearChart.keys,
  },
  yaxis: {
    show: false,
  },
};

export const TotalRecommendation = recommendation_Counts_bar_chart.countOfRecommendation;

// Copy code
const recommendationCounts = recommendation_Counts_bar_chart.values.map(String);
export const barChartDataWeeklyRevenue = [
  {
    name: "Recommendation ",
    data: recommendationCounts,
    // data:[20, 3, 52, 31, 24, 15, 3, 7, 8, 9, 10],
    color: "#6AD2Fa",
  },
];

export const barChartOptionsWeeklyRevenue = {
  chart: {
    stacked: true,
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    style: {
      fontSize: "12px",
      fontFamily: undefined,
      backgroundColor: "#000000",
    },
    theme: "dark",
    onDatasetHover: {
      style: {
        fontSize: "12px",
        fontFamily: undefined,
      },
    },
  },
  xaxis: {
    categories: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    show: false,
    labels: {
      show: true,
      style: {
        colors: "#A3AED0",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
    color: "black",
    labels: {
      show: false,
      style: {
        colors: "#A3AED0",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
  },
  grid: {
    borderColor: "rgba(163, 174, 208, 0.3)",
    show: true,
    yaxis: {
      lines: {
        show: false,
        opacity: 0.5,
      },
    },
    row: {
      opacity: 0.5,
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      type: "vertical",
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      colorStops: [
        {
          offset: 0,
          color: "#4318FF",
          opacity: 1,
        },
        {
          offset: 100,
          color: "rgba(67, 24, 255, 1)",
          opacity: 0.28,
        },
      ],
    },
  },
  legend: {
    show: false,
  },
  colors: ["#5E37FF", "#6AD2FF", "#E1E9F8"],
  dataLabels: {
    enabled: true,
    style: {
      fontSize: "14px",
      fontWeight: "bold",
      colors: ["#000000"], // Adjust the color as needed
    },
    formatter: function(val) {
      return val; // Return the value to be displayed
    },
    offsetY: -25, // Adjust this value to position the label above the bar
    dropShadow: {
      enabled: true,
      top: 1,
      left: 1,
      blur: 1,
      opacity: 0.45,
    },
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      columnWidth: "45px",
      dataLabels: {
        position: 'top', // Place the data label at the top of the bar
      },
    },
  },
};


// fetchData.js



// variables/charts.js
export const funnelChartData2 = [20, 30, 50];

export const funnelChartOptions2 = {
  chart: {
    type: 'funnel',
    width: '100%',
  },
  labels: ["Excellent, Very Good, Good", "Average", "Poor"],
  colors: ["#552FFF", "#5fbde5", "#fbdb5c"],
  states: {
    hover: {
      filter: {
        type: 'none',
      },
    },
  },
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: '14px',
      fontWeight: 'bold',
      colors: ["#000000"],
    },
    formatter: function(val) {
      return `${val}%`;
    },
  },
  tooltip: {
    enabled: true,
    theme: 'dark',
    style: {
      fontSize: '12px',
      backgroundColor: '#000000',
      color: '#000000',
    },
    marker: {
      show: true,
    },
    x: {
      show: true,
      style: {
        color: '#000000',
        fontSize: '12px',
      },
    },
    y: {
      formatter: (val) => `${val}%`,
      title: {
        formatter: (seriesName) => seriesName,
        style: {
          color: '#000000',
          fontSize: '12px',
        },
      },
    },
  },
  plotOptions: {
    funnel: {
      curve: {
        enabled: true,
      },
      labels: {
        show: true,
        name: {
          fontSize: '16px',
          fontWeight: 600,
        },
        value: {
          fontSize: '14px',
          fontWeight: 400,
        },
        total: {
          show: true,
          label: 'Total',
          formatter: function (w) {
            return w.globals.seriesTotals.reduce((a, b) => {
              return a + b;
            }, 0);
          },
        },
      },
    },
  },
  fill: {
    colors: ["#4318FF", "#6AD2FF", "#fbdb5c"],
  },
};

// export const  satisfactionPieChart = satisfactionPieChart




///====================================================================

// // charts.js
// export const barChartDataDailyTraffic = [
//   {
//     name: "Daily Traffic",
//     data: [20, 30, 40, 20, 45, 50, 30],
//   },
// ];

// export const barChartOptionsDailyTraffic = {
//   // chart configuration options
// };

// export const pieChartData = [63, 25, 12];
// export const pieChartOptions = {
//   labels: ["Good", "Average", "Poor"],
//   // other chart options
// };

// export const pieChartData2 = [46, 35, 22];
// export const pieChartOptions2 = {
//   labels: ["Excellent, Very Good, Good", "Average", "Poor"],
//   // other chart options
// };

// export const lineChartDataTotalSpent = [
//   {
//     name: "Feedbacks",
//     data: [250, 564, 448, 366, 469, 468],
//     color: "#4318FF",
//   },
//   {
//     name: "Customer Data",
//     data: [3076, 4657, 2094, 4976, 2120, 4698],
//     color: "#6AD2FF",
//   },
// ];

// export const lineChartOptionsTotalSpent = {
//   // chart configuration options
// };

// export const barChartDataWeeklyRevenue = [
//   {
//     name: "Recommendation A",
//     data: [400, 370, 330, 390, 320, 350, 360, 320, 380, 401],
//     color: "#6AD2Fa",
//   },
// ];

// export const barChartOptionsWeeklyRevenue = {
//   // chart configuration options
// };

// export const TotalFeedbacks = 265;
// export const TotalRecommendation = 132;
