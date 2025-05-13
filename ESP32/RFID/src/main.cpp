#include <WiFi.h>
#include <MFRC522.h>
#include <SPI.h>

#define SS_PIN 15
#define RST_PIN 5
MFRC522 mfrc522(SS_PIN, RST_PIN);

String CardUID;

String GetByteArray(byte *Buffer, byte BufferSize)
{
  String Data;

  for (byte i = 0; i < BufferSize; i++)
  {
    Data += String(Buffer[i], HEX);
  }

  return Data;
}
String GetMacAddress()
{
  uint8_t Mac[6];
  WiFi.MacAddress(Mac);
  String MacAddress = "";
  for (int i = 0; i < 6; i++)
  {
    if (Mac[i] < 0x10)
    {
      MacAddress += "0";
    }
    MacAddress += String(Mac[i], HEX);
    if (i < 5)
    {
      MacAddress += ":";
    }
  }
  return MacAddress;
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

  String NewCardUID = GetByteArray(mfrc522.uid.uidByte, mfrc522.uid.size);

  if (NewCardUID != CardUID)
  { // If new card is found ...
    CardUID = NewCardUID;
    String MacAddress = GetMacAddress();

    Serial.print("New card detected with UID: ");
    Serial.println(CardUID);
    Serial.print("ESP32 Mac Address: ");
    Serial.println(MacAddress);
  }
}
