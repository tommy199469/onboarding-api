import { Request, Response } from "express";
import axios from "axios";
import moment from "moment";
import { sgKey, openAPI } from "../config";
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(sgKey);

const openWeatherApi = `https://api.openweathermap.org/data/3.0/onecall?lat={LAT}&lon={LON}&exclude=daily,minutely&appid=${openAPI}`;

const getUv = async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.query;
    const data = await axios.get(
      openWeatherApi
        .replace("{LAT}", lat.toString())
        .replace("{LON}", lng.toString())
    );

    const { current } = data.data;

    res.status(200).json({
      status: true,
      message: "success getting uv",
      data: current || null,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "error" });
  }
};

const subscribe = async (req: Request, res: Response) => {
  try {
    const { email, lat, lng } = req.body;

    const data = await axios.get(
      openWeatherApi
        .replace("{LAT}", lat.toString())
        .replace("{LON}", lng.toString())
    );
    const { hourly, current } = data.data;

    // Get current timestamp in seconds
    const currentTimestamp = Math.floor(Date.now() / 1000);
    // Find the next hour object
    const nextHourObject = hourly.find(
      (item: any) => item.dt > currentTimestamp
    );

    // Convert Kelvin to Fahrenheit and then to Celsius
    const kelvinToFahrenheit = (k: any) => ((k - 273.15) * 9) / 5 + 32;
    const fahrenheitToCelsius = (f: any) => ((f - 32) * 5) / 9;

    // current

    const dateTime = moment(new Date(current.dt * 1000)).format(
      "DD/MM/YYYY HH:mm"
    );

    const tempCelsius = fahrenheitToCelsius(kelvinToFahrenheit(current.temp));
    const feelsLikeCelsius = fahrenheitToCelsius(
      kelvinToFahrenheit(current.feels_like)
    );

    // next hour
    const nextHourDateTime = moment(new Date(nextHourObject.dt * 1000)).format(
      "DD/MM/YYYY HH:mm"
    );

    const nextHourTempCelsius = fahrenheitToCelsius(
      kelvinToFahrenheit(nextHourObject.temp)
    );
    const nextHourFeelsLikeCelsius = fahrenheitToCelsius(
      kelvinToFahrenheit(nextHourObject.feels_like)
    );

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body { font-family: Arial, sans-serif; }
              .weather-report { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 10px 0; background-color: #f9f9f9; }
              .weather-report h2 { color: #017bff; }
              .weather-info { margin: 20px 0; }
              .weather-info p { line-height: 1.6; }
          </style>
      </head>
      <body>
          <div class="weather-report">
              <h3>Reminder for Refill Sunscreen</h3>
              <h2>Current Weather</h2>
              <div class="weather-info">
                  <p><strong>Date and Time:</strong> ${dateTime}</p>
                  <p><strong>Temperature:</strong> ${tempCelsius.toFixed(
                    2
                  )}°C (Feels like ${feelsLikeCelsius.toFixed(2)}°C)</p>
                  <p><strong>UV Index:</strong>${current.uvi}</p>
                  <p><strong>Weather Condition:</strong> ${
                    current.weather[0].description
                  }</p>
                  <p><strong>Cloud Coverage:</strong> ${current.clouds}%</p>
              </div>

              <h2>Next Hour Weather Reminder</h2>
              <div class="weather-info">
                  <p><strong>Date and Time:</strong> ${nextHourDateTime}</p>
                  <p><strong>Temperature:</strong> ${nextHourTempCelsius.toFixed(
                    2
                  )}°C (Feels like ${nextHourFeelsLikeCelsius.toFixed(2)}°C)</p>
                  <p><strong>UV Index:</strong>${nextHourObject.uvi}</p>
                  <p><strong>Weather Condition:</strong> ${
                    nextHourObject.weather[0].description
                  }</p>
                  <p><strong>Cloud Coverage:</strong> ${
                    nextHourObject.clouds
                  }%</p>
              </div>
          </div>
      </body>
      </html>
      `;

    const msg = {
      to: email,
      from: "thomashktoaustralia@gmail.com", // Use the email address or domain you verified above
      subject: "Sending with Twilio SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: htmlContent,
    };
    await sgMail.send(msg);

    res.status(200).json({
      status: true,
      message: "success getting uv",
      data: "done" || null,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "error" });
  }
};

export { getUv, subscribe };
