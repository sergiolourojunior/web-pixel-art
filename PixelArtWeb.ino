#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <FS.h>
#include <Adafruit_NeoPixel.h>

#define BRILHO 10
#define LEDS 100
#define PINO 4

ESP8266WebServer server(80);
Adafruit_NeoPixel fita(LEDS, PINO, NEO_GRB + NEO_KHZ800);

char ssid[30] = ""; // put your Wifi SSID here
char password[30] = ""; // put your Wifi Password here

JsonArray code;
JsonArray stripArray;

void handleHome() {
  File file = SPIFFS.open(F("/index.html"), "r");

  size_t sent = server.streamFile(file, "text/html");

  file.close();
}

void handleJS() {
  File file = SPIFFS.open(F("/script.js"), "r");

  size_t sent = server.streamFile(file, "text/javascript");

  file.close();
}

void handleData() {
  File file = SPIFFS.open(F("/data.json"), "r");

  size_t sent = server.streamFile(file, "text/json");

  file.close();
}

void handleSave() {
  if (server.method() == HTTP_POST) {
    DynamicJsonDocument doc(12288);

    DeserializationError error = deserializeJson(doc, server.arg("plain"));

    // Test if parsing succeeds.
    if (error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.f_str());
      return;
    } else {
      JsonObject request = doc.as<JsonObject>();

      File file = SPIFFS.open(F("/data.json"), "r");

      Serial.println("");
      Serial.print("Program requires size: ");
      Serial.println(doc.memoryUsage());

      Serial.print("File size: ");
      Serial.println(file.size());

      Serial.print("Total memory needed: ");
      Serial.println(doc.memoryUsage() + file.size());

      Serial.print("Max Free Block Size: ");
      Serial.println(ESP.getMaxFreeBlockSize());

      // Serial.print("Free memory Heap: ");
      // Serial.println(ESP.getFreeHeap());

      //Serial.print("malloc(): ");
      //Serial.println(ESP.malloc());

      //Serial.print("free(): ");
      //Serial.println(ESP.free());

      // DynamicJsonDocument dataJson(doc.memoryUsage() + file.size());
      DynamicJsonDocument dataJson(ESP.getMaxFreeBlockSize() - 512);

      Serial.print("dataJson capacity: ");
      Serial.println(dataJson.capacity());

      DeserializationError err = deserializeJson(dataJson, file);

      file.close();
      SPIFFS.remove(F("/data.json"));

      if(err) {
        Serial.print(F("#2 deserializeJson() failed with code "));
        Serial.println(err.f_str());
      } else {
        Serial.println("Success to open file");

        dataJson.add(request);

        File file = SPIFFS.open(F("/data.json"), "w+");
        serializeJson(dataJson, file);

        file.close();

        Serial.println("Finished");
      }
    }

    server.send(200, "application/text", "OK");
  } else {
    Serial.println("Method not Allowed");
  }
}

void setup() {
  Serial.begin(115200);

  SPIFFS.begin();

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("WIFI Connected.");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  server.on("/", handleHome);
  server.on("/script.js", handleJS);
  server.on("/data.json", handleData);
  server.on("/save", handleSave);

  server.begin();
  Serial.println("Server started.");

  fita.begin();
  fita.setBrightness(BRILHO);
  Serial.println("Strip started.");
}

void loop() {
  server.handleClient();

  /*

  File json = SPIFFS.open(F("/data.json"), "r");

  DynamicJsonDocument dataJson(24576);
  DeserializationError err = deserializeJson(dataJson, json);

  json.close();

  if(err) {
    Serial.print(F("3: deserializeJson() failed with code "));
    Serial.println(err.f_str());
  } else {
    for (JsonObject item : dataJson.as<JsonArray>()) {
      const char* name = item["name"];
      const int time = int(item["time"]);

      fita.clear();

      for(int i=0; i<item["code"].size(); i++) {
        fita.setPixelColor(item["code"][i][0], item["code"][i][1], item["code"][i][2], item["code"][i][3]);
      }

      fita.show();

      delay(time * 1000);
    }
  }

  */

}
