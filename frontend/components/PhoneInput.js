import React, { useState } from "react";
import { TextInput, StyleSheet, View } from "react-native";

const PhoneInput = () => {
  const [phone, setPhone] = useState("");

  const formatPhoneNumber = (input) => {
    let cleaned = input.replace(/\D/g, "");
    if (cleaned.length > 11) {
      cleaned = cleaned.slice(0, 11);
    }

    if (cleaned.length > 6) {
      cleaned = `(${cleaned.slice(0, 2)}) ${cleaned.slice(
        2,
        7
      )}-${cleaned.slice(7)}`;
    } else if (cleaned.length > 2) {
      cleaned = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    } else if (cleaned.length > 0) {
      cleaned = `(${cleaned}`;
    }

    return cleaned;
  };

  const handlePhoneChange = (input) => {
    const formattedPhone = formatPhoneNumber(input);
    setPhone(formattedPhone);
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={handlePhoneChange}
        placeholder="(12) 34561-7891"
        keyboardType="numeric"
        maxLength={15} // Max length considerando os caracteres extras da máscara
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#FF914D",
    fontSize: 16,
    paddingVertical: 5,
    color: "#000",
  },
});

export default PhoneInput;
