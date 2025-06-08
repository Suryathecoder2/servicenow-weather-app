var WeatherIntegration = Class.create();
WeatherIntegration.prototype = {
    initialize: function () {},

    getWeather: function (city) {
        // Log entry to verify GlideAjax is calling this method
        gs.info("💡 WeatherIntegration called for city: " + city);

        try {
            // 1. Set up the REST message
            var rm = new sn_ws.RESTMessageV2('Get Weather', 'get');
            rm.setStringParameterNoEscape('city', city);

            // 2. Execute API call
            var response = rm.execute();
            var body = response.getBody();
            var json = JSON.parse(body);

            // 3. Save data into custom table
            var gr = new GlideRecordSecure('x_1552165_weatheri_weather_info');
            gr.initialize();
            gr.city = city;
            gr.temperature = json.main.temp;
            gr.condition = json.weather[0].main;
            gr.retrieved_at = new GlideDateTime();
            gr.insert();

            // 4. Return result as JSON string
            return JSON.stringify({
                temp: json.main.temp,
                condition: json.weather[0].main
            });

        } catch (ex) {
            // 5. Log error in custom log table
            var log = new GlideRecordSecure('x_1552165_weatheri_weather_log');
            log.initialize();
            log.city = city;
            log.error_message = ex.message;
            log.insert();

            // Optional: log to system logs as well
            gs.error("❌ WeatherIntegration error for city '" + city + "': " + ex.message);

            return JSON.stringify({ error: ex.message });
        }
    },

    type: 'WeatherIntegration'
};
