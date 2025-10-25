#include <WiFi.h>
#include <HTTPClient.h>
#include <PubSubClient.h>
#include <Wire.h>
#include "Adafruit_SHT31.h"
#include "time.h"

#define PIR_PIN 14
#define LED_PIN 2

// ====== WiFi ======
const char* ssid = "CS105_Lab";       
const char* password = "COMsci@105";

// ====== PSU Portal Login ======
const char* loginURL = "https://cp-xml-40g.psu.ac.th:6082/php/action_page.php";
const char* portal_user = "6510210073";   
const char* portal_pass = "rakmai31654_";   

// ====== MQTT Server ======
const char* mqtt_server = "47.250.152.169";
const int mqtt_port = 1883;
const char* mqtt_user = "chinnapong";
const char* mqtt_pass = "cs105lab";

// ====== Room ID ======
const char* roomID = "room1";

// ====== Dynamic Topics ======
String topic_data;
String topic_motion;
String topic_control;

// ====== Sensor ======
Adafruit_SHT31 sht31 = Adafruit_SHT31();

WiFiClient espClient;
PubSubClient client(espClient);

// ====== ตัวแปรเวลา ======
unsigned long lastTempHumTime = 0;
const unsigned long tempHumInterval = 30000;
int lastMotionState = LOW;

// ---------- ฟังก์ชันดึง timestamp ----------
String getTimestamp() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) return "unknown";
  char buf[30];
  strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S", &timeinfo);
  return String(buf);
}

// ---------- ฟังก์ชัน login Portal ----------
void wifiPortalLogin() {
  Serial.println("🌐 Logging into PSU Wi-Fi portal...");
  HTTPClient http;
  http.begin(loginURL);
  http.setFollowRedirects(HTTPC_FORCE_FOLLOW_REDIRECTS);
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  
  String postData = "username=" + String(portal_user) +
                    "&password=" + String(portal_pass) +
                    "&login=Login";

  int code = http.POST(postData);
  Serial.printf("🛰 Portal login HTTP code: %d\n", code);
  if (code > 0) {
    String response = http.getString();
    Serial.println("✅ Portal login response (partial):");
    Serial.println(response.substring(0, 120));
  } else {
    Serial.println("⚠️ Portal login failed!");
  }
  http.end();
}

// ---------- MQTT Callback ----------
void callback(char* topic, byte* payload, unsigned int length) {
  String msg;
  for (int i = 0; i < length; i++) msg += (char)payload[i];
  Serial.printf("📥 MQTT [%s]: %s\n", topic, msg.c_str());

  if (msg.indexOf("ON") >= 0) {
    digitalWrite(LED_PIN, HIGH);
    Serial.println("💡 LED ON (from MQTT)");
  } else if (msg.indexOf("OFF") >= 0) {
    digitalWrite(LED_PIN, LOW);
    Serial.println("💡 LED OFF (from MQTT)");
  }
}

// ---------- MQTT Reconnect ----------
void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT...");
    String clientId = String("ESP32Client-") + roomID;
    if (client.connect(clientId.c_str(), mqtt_user, mqtt_pass)) { 

      Serial.println("✅ Connected!");
      client.subscribe(topic_control.c_str());
      Serial.printf("Subscribed: %s\n", topic_control.c_str());
    } else {
      Serial.printf("❌ failed (rc=%d), retrying in 5s...\n", client.state());
      delay(5000);
    }
  }
}

// ---------- ตั้ง Wi-Fi + เวลา (NTP) ----------
void setupWiFiAndTime() {
  Serial.printf("Connecting to Wi-Fi: %s", ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ Wi-Fi connected!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  // Login portal ก่อนใช้งานเน็ต
  wifiPortalLogin();

  // ตั้งเวลา NTP (GMT+7)
  configTime(7 * 3600, 0, "pool.ntp.org", "time.nist.gov");
  delay(2000);
  Serial.println("🕒 NTP time sync complete");
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);
  sht31.begin(0x44);
  pinMode(PIR_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);

  // สร้าง topic ตาม roomID
  topic_data   = String("home/") + roomID + "/data";
  topic_motion = String("home/") + roomID + "/motion";
  topic_control = String("home/") + roomID + "/control";

  Serial.println("📡 MQTT Topics:");
  Serial.println(topic_data);
  Serial.println(topic_motion);
  Serial.println(topic_control);

  setupWiFiAndTime();

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  reconnectMQTT();
}

// ---------- Loop ----------
void loop() {
  if (!client.connected()) reconnectMQTT();
  client.loop();

  int motion = digitalRead(PIR_PIN);
  unsigned long now = millis();

  // 📡 ส่งเฉพาะตอนตรวจพบคนเดินผ่าน
  if (motion == HIGH && lastMotionState == LOW) {
    String ts = getTimestamp();
    char msg[200];
    snprintf(msg, sizeof(msg),
             "{\"roomID\":\"%s\",\"motion\":1,\"timestamp\":\"%s\"}",
             roomID, ts.c_str());
    Serial.printf("🚶‍♂️ Motion detected! Publish: %s\n", msg);
    client.publish(topic_motion.c_str(), msg);
  }
  lastMotionState = motion;

  // 🌡 ส่งข้อมูล temp/hum ทุก 30 วิ พร้อม timestamp
  if (now - lastTempHumTime > tempHumInterval) {
    float t = sht31.readTemperature();
    float h = sht31.readHumidity();
    if (!isnan(t) && !isnan(h)) {
      String ts = getTimestamp();
      char msg[250];
      snprintf(msg, sizeof(msg),
               "{\"roomID\":\"%s\",\"temp\":%.2f,\"hum\":%.2f,\"timestamp\":\"%s\"}",
               roomID, t, h, ts.c_str());
      Serial.printf("📤 Publish %s : %s\n", topic_data.c_str(), msg);
      client.publish(topic_data.c_str(), msg);
    }
    lastTempHumTime = now;
  }

  delay(200);
}
