import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, ScrollView, Vibration, Alert, Touchable, TouchableOpacity } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { render } from 'react-dom';
import { LinearGradient } from 'expo-linear-gradient';
import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const Excel = require('exceljs');
const workbook = new Excel.Workbook();

workbook.creator = '작성자';
workbook.lastModifiedBy = '최종 수정자';
workbook.created = new Date();
workbook.modified = new Date();

workbook.addWorksheet('Sheet One');
workbook.addWorksheet('Sheet Two');
workbook.addWorksheet('Sheet Three');

const sheetOne = workbook.getWorksheet('Sheet One');
sheetOne.columns = [
  {header: 'ingredient', key: 'i', width: 40},
  {header: 'counts', key: 'c', width: 40},
  {header: 'reactions', key: 'r', width:40},
]

class HomeScreen extends React.Component {
  
  
  state = {
    "egg" : false,
    "cow" : false,
    "pig" : false,
    "chi" : false,
    "sae" : false,
    "gae" : false,
    "squid" : false,
    "high" : false,
    "jo" : false,
    "milk" : false,
    "nut" : false,
    "brainnut" : false,
    "jat" : false,
    "big" : false,
    "tomato" : false,
    "peach" : false,
    "mil" : false,
    "memil" : false,
    "wine" : false
  }

  saveItem = async () => {
    await AsyncStorage.setItem('@app:state',JSON.stringify(this.state));
  }
  getItem = async () => {
    await AsyncStorage.getItem('@app:state').then((state)=> {
      /*console.log('------')
      console.log(this.state);
      console.log(JSON.parse(state))*/
      let tempObj = Object.assign({}, JSON.parse(state))
      this.setState(tempObj)
      console.log(this.state)
    });
  }
  excel = async (prdnm) => {
    var xhr = new XMLHttpRequest();
    var url = 'http://apis.data.go.kr/B553748/CertImgListService/getCertImgListService'; /URL/
    var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'4Es3IAYWvtEjQloH9aZivTA0FhZMzBQbDRsGvzwvSpWjQfBd%2BGkPTUj7TNeAltYbfnkZd%2BMPvvlwmdYPH%2FC%2BXw%3D%3D'; /Service Key/
    queryParams += '&' + encodeURIComponent('prdlstReportNo') + '=' + encodeURIComponent(prdnm); //
    queryParams += '&' + encodeURIComponent('returnType') + '=' + encodeURIComponent('xml'); //
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); //
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /**/
    xhr.open('GET', url + queryParams);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
          var rawmtrl = (this.responseText).split("<rawmtrl>")[1].split("</rawmtrl>")[0].trim();
          rawmtrl = rawmtrl.replace(/\{[^}]*/g, "").replace(/[}]*/g, "").replace(/\([^)]*/g, "").replace(/[)]*/g, "").replace(/[^a-zA-Zㄱ-힣,]/g, "");
          rawmtrl = rawmtrl.split(",");
          rawmtrl.forEach(element => {
            var temp = 0;
            sheetOne.eachRow((row) => {
              if (row.getCell('i').value==element) {
                row.getCell('c').value += 1
                temp = 1;
              }
            })
            if (temp==0) {
              sheetOne.addRow({i:element, c:1, r:0})
            }
          });
          sheetOne.eachRow((row) => {
            console.log(row.values)
          })
        }
    };
  }
  nfcRead = async () => {
    try {
      Alert.alert("NFC 리딩중...");
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      const parsed = tag.ndefMessage.map(decodeNdefRecord);
      console.log(parsed[0]);
      
      function decodeNdefRecord(record) {
        return Ndef.text.decodePayload(record.payload);
      }
      var text=parsed[0];
      console.log('tag: '+ text);
      var list = text.split('/');
      var warn = [];
      for (var item of list) {
        if (item == "") {
          continue;
        }
        var food = item.split('&')[0];
        var alles = item.split('&')[1].split(', ');
        var prdnm = item.split('&')[2];
        this.excel(prdnm);
        for (var allergy of alles) {
          console.log(allergy);
          if (allergy=="계란" && this.state.egg==true) {
            warn.push("계란이 "+food+"에서 검출되었어요!")
          }
          if (allergy=="밀" && this.state.mil==true) {
            warn.push("밀이 "+food+"에서 검출되었어요!")
          }
          if (allergy=="우유" && this.state.milk==true) {
            warn.push("우유가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="닭고기" && this.state.chi==true) {
            warn.push("닭고기가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="쇠고기" && this.state.cow==true) {
            warn.push("쇠고기가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="새우" && this.state.sae==true) {
            warn.push("새우가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="대두" && this.state.big==true) {
            warn.push("대두가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="돼지고기" && this.state.pig==true) {
            warn.push("돼지고기가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="복숭아" && this.state.peach==true) {
            warn.push("복숭아가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="토마토" && this.state.tomato==true) {
            warn.push("토마토가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="게" && this.state.gae==true) {
            warn.push("게가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="고등어" && this.state.high==true) {
            warn.push("고등어가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="조개류" && this.state.jo==true) {
            warn.push("조개류 "+food+"에서 검출되었어요!")
          }
          if (allergy=="오징어" && this.state.squid==true) {
            warn.push("오징어가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="잣" && this.state.jat==true) {
            warn.push("잣이 "+food+"에서 검출되었어요!")
          }
          if (allergy=="아황산" && this.state.wine==true) {
            warn.push("아황산류가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="호두" && this.state.brainnut==true) {
            warn.push("호두가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="메밀" && this.state.memil==true) {
            warn.push("메밀이 "+food+"에서 검출되었어요!")
          }
          if (allergy=="땅콩" && this.state.nut==true) {
            warn.push("땅콩이 "+food+"에서 검출되었어요!")
          }
        }
      }
      warn.sort();
      if(warn.length==0) {
        Alert.alert("알레르기 식품이 없습니다! :)");
      }
      else {
        Alert.alert("알레르기 검출!",warn.join("\n\n"));
      }
      Vibration.vibrate(400);
      NfcManager.cancelTechnologyRequest().catch(() => 0);
  } catch (ex) {
      this.setState({
          log: ex.toString()
      })
      
  }
}
  render() {
    return (
      <LinearGradient colors={['#FFAC9B', '#FFC7BF', '#FFD4CE']} style={styles.container}>
          <TouchableOpacity style={styles.button}
                 onPress={() => {
                  this.nfcRead(); //"칸타타프리미엄라떼&우유/"
                }}>
                  <Text style={styles.text}>NFC</Text>
          </TouchableOpacity>
          <View style={styles.border}>
            <ScrollView style={styles.scrollw}>
              <BouncyCheckbox
                size={35}
                style={{ marginTop: 16 }}
                fillColor="pink"
                text="난류"
                iconStyle={{ borderColor: "pink" }}
                textStyle={{
                  textDecorationLine: "none",
                  fontSize: 22
                }}
                onPress={() => {
                  this.state.egg = this.state.egg ? false : true;
                  console.log(this.state);
                }
                }
                isChecked = {this.state.egg}
              />
              <BouncyCheckbox
                size={35}
                style={{ marginTop: 16 }}
                fillColor="pink"
                text="소고기"
                iconStyle={{ borderColor: "pink" }}
                textStyle={{
                  textDecorationLine: "none",
                  fontSize: 22
                }}
                onPress={() => {
                  this.state.cow = this.state.cow ? false : true;
                }
                }
                isChecked = {this.state.cow}
              />
              <BouncyCheckbox
                size={35}
                style={{ marginTop: 16 }}
                fillColor="pink"
                text="돼지고기"
                iconStyle={{ borderColor: "pink" }}
                textStyle={{
                  textDecorationLine: "none",
                  fontSize: 22
                }}
                onPress={() => {
                  this.state.pig = this.state.pig ? false : true;
                }
                }
                isChecked = {this.state.pig}
              />
              <BouncyCheckbox
                size={35}
                style={{ marginTop: 16 }}
                fillColor="pink"
                text="닭고기"
                iconStyle={{ borderColor: "pink" }}
                textStyle={{
                  textDecorationLine: "none",
                  fontSize: 22
                }}
                onPress={() => {
                  this.state.chi = this.state.chi ? false : true;
                }
                }
                isChecked = {this.state.chi}
              />
              <BouncyCheckbox
                size={35}
                style={{ marginTop: 16 }}
                fillColor="pink"
                text="새우"
                iconStyle={{ borderColor: "pink" }}
                textStyle={{
                  textDecorationLine: "none",
                  fontSize: 22
                }}
                onPress={() => {
                  this.state.sae = this.state.sae ? false : true;
                }
                }
                isChecked = {this.state.sae}
              />
              <BouncyCheckbox
                size={35}
                style={{ marginTop: 16 }}
                fillColor="pink"
                text="게"
                iconStyle={{ borderColor: "pink" }}
                textStyle={{
                  textDecorationLine: "none",
                  fontSize: 22
                }}
                onPress={() => {
                  this.state.gae = this.state.gae ? false : true;
                }
                }
                isChecked = {this.state.gae}
              />
              <BouncyCheckbox
                size={35}
                style={{ marginTop: 16 }}
                fillColor="pink"
                text="오징어"
                iconStyle={{ borderColor: "pink" }}
                textStyle={{
                  textDecorationLine: "none",
                  fontSize: 22
                }}
                onPress={() => {
                  this.state.squid = this.state.squid ? false : true;
                }
                }
                isChecked = {this.state.squid}
              />
              <BouncyCheckbox
                size={35}
                style={{ marginTop: 16 }}
                fillColor="pink"
                text="고등어"
                iconStyle={{ borderColor: "pink" }}
                textStyle={{
                  textDecorationLine: "none",
                  fontSize: 22
                }}
                onPress={() => {
                  this.state.high = this.state.high ? false : true;
                }
                }
                isChecked = {this.state.high}
              />
              <BouncyCheckbox
                size={35}
                style={{ marginTop: 16 }}
                fillColor="pink"
                text="조개류"
                iconStyle={{ borderColor: "pink" }}
                textStyle={{
                  textDecorationLine: "none",
                  fontSize: 22
                }}
                onPress={() => {
                  this.state.jo = this.state.jo ? false : true;
                }
                }
                isChecked = {this.state.jo}
              />
              <BouncyCheckbox
                size={35}
                style={{ marginTop: 16 }}
                fillColor="pink"
                text="우유"
                iconStyle={{ borderColor: "pink" }}
                textStyle={{
                  textDecorationLine: "none",
                  fontSize: 22
                }}
                onPress={() => {
                  this.state.milk = this.state.milk ? false : true;
                }
                }
                isChecked = {this.state.milk}
              />
              <BouncyCheckbox
                size={35}
                style={{ marginTop: 16 }}
                fillColor="pink"
                text="땅콩"
                iconStyle={{ borderColor: "pink" }}
                textStyle={{
                  textDecorationLine: "none",
                  fontSize: 22
                }}
                onPress={() => {
                  this.state.nut = this.state.nut ? false : true;
                }
                }
                isChecked = {this.state.nut}
              />
              <BouncyCheckbox
                size={35}
                style={{ marginTop: 16 }}
                fillColor="pink"
                text="호두"
                iconStyle={{ borderColor: "pink" }}
                textStyle={{
                  textDecorationLine: "none",
                  fontSize: 22
                }}
                onPress={() => {
                  this.state.brainnut = this.state.brainnut ? false : true;
                }
                }
                isChecked = {this.state.brainnut}
              />
              <BouncyCheckbox
                size={35}
                style={{ marginTop: 16 }}
                fillColor="pink"
                text="잣"
                iconStyle={{ borderColor: "pink" }}
                textStyle={{
                  textDecorationLine: "none",
                  fontSize: 22
                }}
                onPress={() => {
                  this.state.jat = this.state.jat ? false : true;
                }
                }
                isChecked = {this.state.jat}
              />
              <BouncyCheckbox
                size={35}
                style={{ marginTop: 16 }}
                fillColor="pink"
                text="대두"
                iconStyle={{ borderColor: "pink" }}
                textStyle={{
                  textDecorationLine: "none",
                  fontSize: 22
                }}
                onPress={() => {
                  this.state.big = this.state.big ? false : true;
                }
                }
                isChecked = {this.state.big}
              />
              <BouncyCheckbox
                size={35}
                style={{ marginTop: 16 }}
                fillColor="pink"
                text="토마토"
                iconStyle={{ borderColor: "pink" }}
                textStyle={{
                  textDecorationLine: "none",
                  fontSize: 22
                }}
                onPress={() => {
                  this.state.tomato = this.state.tomato ? false : true;
                }
                }
                isChecked = {this.state.tomato}
              />
              <BouncyCheckbox
                size={35}
                style={{ marginTop: 16 }}
                fillColor="pink"
                text="복숭아"
                iconStyle={{ borderColor: "pink" }}
                textStyle={{
                  textDecorationLine: "none",
                  fontSize: 22
                }}
                onPress={() => {
                  this.state.peach = this.state.peach ? false : true;
                }
                }
                isChecked = {this.state.peach}
              />
              <BouncyCheckbox
                size={35}
                style={{ marginTop: 16 }}
                fillColor="pink"
                text="밀"
                iconStyle={{ borderColor: "pink" }}
                textStyle={{
                  textDecorationLine: "none",
                  fontSize: 22
                }}
                onPress={() => {
                  this.state.mil = this.state.mil ? false : true;
                }
                }
                isChecked = {this.state.mil}
              />
              <BouncyCheckbox
                size={35}
                style={{ marginTop: 16 }}
                fillColor="pink"
                text="메밀"
                iconStyle={{ borderColor: "pink" }}
                textStyle={{
                  textDecorationLine: "none",
                  fontSize: 22
                }}
                onPress={() => {
                  this.state.memil = this.state.memil ? false : true;
                }
                }
                isChecked = {this.state.memil}
              />
              <BouncyCheckbox
                size={35}
                style={{ marginTop: 16 }}
                fillColor="pink"
                text="아황산류"
                iconStyle={{ borderColor: "pink" }}
                textStyle={{
                  textDecorationLine: "none",
                  fontSize: 22
                }}
                onPress={() => {
                  this.state.wine = this.state.wine ? false : true;
                }
                }
                isChecked = {this.state.wine}
              />
            </ScrollView>
            <View style={styles.banner}>
              <Text style={{fontSize:19, fontWeight:'bold', color:'#FFEFEF'}}>{"\n"}당신의 알레르기 정보를 입력하여 주세요.</Text>
            </View>
            <Button
              title = 'Go detail screen'
              onPress = {()=>this.props.navigation.navigate('Details')}/>
        </View>        
      </LinearGradient> 
    );
  };
  
  /*

  componentWillUnmount() {
    console.log('2')
    NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    NfcManager.unregisterTagEvent().catch(() => 0);
  }*/

  async NFC() {
    /*console.log('nfc start');
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      let parsed = null;
      console.log(tag.ndefMessage);
      if (tag.ndefMessage) {
          const ndefRecords = tag.ndefMessage;

          function decodeNdefRecord(record) {
              if (Ndef.isType(record, Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
                  return ['text', Ndef.text.decodePayload(record.payload)];
              } else if (Ndef.isType(record, Ndef.TNF_WELL_KNOWN, Ndef.RTD_URI)) {
                  return ['uri', Ndef.uri.decodePayload(record.payload)];
              }

              return ['unknown', '---']
          }

          parsed = ndefRecords.map(decodeNdefRecord);
          console.warn('data found', parsed);
      }
      else {
        console.warn('none data..');
      }
    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }*/

  }
}

class DetailsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Seonoh Detail Screen</Text>
        <Button
          title = 'Go Home screen'
          onPress = {()=>this.props.navigation.navigate('Home')}/>
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD2CC',
    alignItems:'stretch',
    justifyContent: 'center',
  },
  border: {
    flex: 1,
    marginLeft: 10,
    marginBottom: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#FFF6F4',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 20,
    shadowRadius: 15 ,
    shadowOffset : { width: 1, height: 13},
  },
  banner: {
    flexBasis:80,
    minHeight: 1,
    alignItems: 'center',
    backgroundColor: '#FF6666',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20
  },
  scrollw : {
    flexBasis: 1,
    marginTop:10,
    marginLeft: 20,
    marginBottom: 10
  },
  button : {
    backgroundColor: "#FF6666",
    borderRadius: 10,
    margin: 10,
    marginBottom: 5,
    height: 40,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 12,
    shadowRadius: 15 ,
    shadowOffset : { width: 1, height: 13},
  },
  text : {
    textAlign: 'center',
    fontSize: 24,
    color: "white",
    justifyContent: "center",
    alignItems: "center"
  }
});

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen
  },
  {
    initialRouteName: 'Home',
    headerShown: false,
  },
);
 
export default createAppContainer(AppNavigator);
