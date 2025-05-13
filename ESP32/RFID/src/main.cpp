#include <WiFi.h>
#include <MFRC522.h>
#include <SPI.h>

#define SS_PIN 15
#define RST_PIN 5
MFRC522 mfrc522(SS_PIN, RST_PIN);

String cardUID;

String get_byte_array(byte *buffer, byte bufferSize)
{
  String data;

  for (byte i = 0; i < bufferSize; i++)
  {
    data += String(buffer[i], HEX);
  }

  return data;
}
String getMacAddress()
{
  uint8_t mac[6];
  WiFi.macAddress(mac);
  String macAddress = "";
  for (int i = 0; i < 6; i++)
  {
    if (mac[i] < 0x10)
    {
      macAddress += "0";
    }
    macAddress += String(mac[i], HEX);
    if (i < 5)
    {
      macAddress += ":";
    }
  }
  return macAddress;
}

void setup()
{
  Serial.begin(115200);
  SPI.begin();

  mfrc522.PCD_Init();

  Serial.println("Waiting for card...");
  Serial.println();
}

void loop()
{
  if (!mfrc522.PICC_IsNewCardPresent())
    return;

  if (!mfrc522.PICC_ReadCardSerial())
    return;

  String newCardUID = get_byte_array(mfrc522.uid.uidByte, mfrc522.uid.size);

  if (newCardUID != cardUID)
  { // If new card is found ...
    cardUID = newCardUID;
    String macAddress = getMacAddress();

    Serial.print("New card detected with UID: ");
    Serial.println(cardUID);
    Serial.print("ESP32 MAC Address: ");
    Serial.println(macAddress);
  }
}
