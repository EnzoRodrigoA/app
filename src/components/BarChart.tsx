import React from "react";
import { Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
export const LineChartComponent = () => {
  const data = [
    {
      value: 2500,
      frontColor: "#006DFF",
      gradientColor: "#009FFF",
      spacing: 6,
      label: "Jan",
    },
    { value: 2400, frontColor: "#3BE9DE", gradientColor: "#93FCF8" },

    {
      value: 3500,
      frontColor: "#006DFF",
      gradientColor: "#009FFF",
      spacing: 6,
      label: "Feb",
    },
    { value: 3000, frontColor: "#3BE9DE", gradientColor: "#93FCF8" },

    {
      value: 4500,
      frontColor: "#006DFF",
      gradientColor: "#009FFF",
      spacing: 6,
      label: "Mar",
    },
    { value: 4000, frontColor: "#3BE9DE", gradientColor: "#93FCF8" },

    {
      value: 5200,
      frontColor: "#006DFF",
      gradientColor: "#009FFF",
      spacing: 6,
      label: "Apr",
    },
    { value: 4900, frontColor: "#3BE9DE", gradientColor: "#93FCF8" },

    {
      value: 3000,
      frontColor: "#006DFF",
      gradientColor: "#009FFF",
      spacing: 6,
      label: "May",
    },
    { value: 2800, frontColor: "#3BE9DE", gradientColor: "#93FCF8" },
  ];
  return (
    <View
      style={{
        margin: 10,
        padding: 16,
        borderRadius: 20,
        backgroundColor: "#232b5d0",
      }}
    >
      <BarChart
        data={data}
        barWidth={16}
        initialSpacing={20}
        spacing={20}
        hideRules
        hideAxesAndRules
        barBorderRadius={1}
        yAxisThickness={0}
        yAxisTextStyle={{ color: "lightgray" }}
        maxValue={6000}
        labelWidth={40}
        xAxisLabelTextStyle={{ color: "lightgray", textAlign: "center" }}
        isAnimated
        renderTooltip={(item: any, index: number) => {
          return (
            <View
              style={{
                marginBottom: 2,
                marginLeft: -15,
                outlineColor: "red",
              }}
            >
              <Text>{item.value}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};
