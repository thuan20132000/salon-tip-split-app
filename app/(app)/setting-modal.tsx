import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import ButtonIcon from '@/components/commons/ButtonIcon';
import { commonStyles } from '@/utils/commonStyles';
import ButtonText from '@/components/commons/ButtonText';
import CurrencyInput from 'react-native-currency-input';
import { Colors } from '@/constants/Colors';
import { SettingState, useSettingsStore } from '@/store/useSettingsStore';
import { helper } from '@/utils/helper';
import { ms } from 'react-native-size-matters';
import { RootState, useRootStore } from '@/store/useRootStore';
import { useRouter } from 'expo-router';

const SettingModal: React.FC = () => {

  const {
    salonSettings,
    setSalonSettings,
    updateSalonSettings
  } = useSettingsStore((state: SettingState) => state);

  const router = useRouter();

  const {
    setIsLoading,
  } = useRootStore((state: RootState) => state);

  const [taxRate, setTaxRate] = useState<number>(0);
  const [logoUrl, setLogoUrl] = useState('');

  const handleSave = async () => {
    try {
      setIsLoading(true);
      let taxRateDecimal = helper.percentageToDecimal(taxRate);
      await updateSalonSettings({
        tax_rate: taxRateDecimal
      })
      router.back();
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setTaxRate(helper.decimalToPercentage(salonSettings?.tax_rate));
  }, [])

  console.log('salonSettings:: ', salonSettings);


  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text>Taxes</Text>
        <CurrencyInput
          value={taxRate}
          onChangeValue={(value) => setTaxRate(Number(value))}
          style={[commonStyles.textInput, { flex: 1 }]}
          precision={0}
          minValue={0}
          maxValue={100}
          inputMode='numeric'
          suffix="%"
          placeholder="0%"
        />
      </View>

      <ButtonText
        title="Save"
        onPress={handleSave}
        style={styles.button}
      />
    </View>
  )
}

export default SettingModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.primary.white,
  },
  button: {
    marginTop: ms(16),
    width: '100%',
    alignSelf: 'flex-end',
    backgroundColor: Colors.secondary.blue,
    borderRadius: 10,
    padding: 10,
  }
})