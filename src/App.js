import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, ScrollView, Vibration, Alert, TouchableOpacity, FlatList, Image } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { LinearGradient } from 'expo-linear-gradient';
import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

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
const sheetTwo = workbook.getWorksheet('Sheet Two');
sheetTwo.columns = [
  {header: 'users', key: 'u', width: 40},
  {header: 'data', key: 'd', width: 40},
  {header: 'food', key: 'f', width: 40},
]
sheetTwo.addRow(
  {u: 'user', d:'', f:''},
)
sheetTwo.addRow(
  {u: 'james', d: '새우,새우크래커,팜유', f: '19720154001156'},
)
sheetTwo.addRow(
  {u: 'joe', d:'새우,새우크래커,팜유,오렌지 농축액', f:'19720154001156,오렌지 주스'},
)
sheetTwo.addRow(
  {u: 'jake', d: '새우크래커,새우, 새우맛베이스', f: '19720154001156'},
)
sheetTwo.addRow(
  {u: 'john', d: '보리분말, 우유, 감자전분', f: '칸타타프리미엄라떼, 고래밥'},
)
sheetTwo.addRow(
  {u: 'june', d: '우유, 새우크래커,새우', f: '19720154001156, 칸타타프리미엄라떼'},
)
sheetTwo.addRow(
  {u: 'jane', d: '우유,새우', f: '칸타타프리미엄라떼'}
)


var state = {
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
var a;
var temp = [];
function HomeScreen( {navigation} )  {
  const [foodListNum, setFoodListNum] = useState([]);

  const excel = async (prdnm) => {
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
        }
    };
    xhr.send('');
    var flist
    sheetTwo.eachRow((row) => {
      if (row.getCell('u').value=='user') {
        flist = row.getCell('d').value.split(',');
        flist.forEach(element => {
          sheetTwo.eachRow((row2) => {
            //console.log(element,prdnm)
           //console.log(row2.getCell('d').value.split(',').includes(element) , row2.getCell('f').value.split(',').includes(prdnm))
            if (row2.getCell('d').value.split(',').includes(element) && row2.getCell('f').value.split(',').includes(prdnm)) {
              a=1
              return element;
            }
          })
        })
      }
    })
    return 1;
  }
  function sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
  }
  const nfcRead = async () => {
      Alert.alert("NFC 리딩중...");
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      const parsed = tag.ndefMessage.map(decodeNdefRecord);
      
      function decodeNdefRecord(record) {
        return Ndef.text.decodePayload(record.payload);
      }
      var text=parsed[0];
      var list = text.split('/');
      var warn = [];
      var warn2 =''
      
      for (var item of list) {
        if (item == "") {
          continue;
        }
        var food = item.split('&')[0];
        var alles = item.split('&')[1].split(', ');
        var prdnm = item.split('&')[2];
        temp= temp.concat([[food,prdnm]])
        a=0
        excel(prdnm)
        
        console.log(a)
        if (a!=0) {
          console.log('??')
          warn2 += '당신과 유사한 사람이 \''+food+'\'에 반응하였어요.','식품 구매에 주의를 요합니다.\n'
        };
        
        for (var allergy of alles) {
          if (allergy=="계란" && state.egg==true) {
            warn.push("계란이 "+food+"에서 검출되었어요!")
          }
          if (allergy=="밀" && state.mil==true) {
            warn.push("밀이 "+food+"에서 검출되었어요!")
          }
          if (allergy=="우유" && state.milk==true) {
            warn.push("우유가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="닭고기" && state.chi==true) {
            warn.push("닭고기가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="쇠고기" && state.cow==true) {
            warn.push("쇠고기가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="새우" && state.sae==true) {
            warn.push("새우가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="대두" && state.big==true) {
            warn.push("대두가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="돼지고기" && state.pig==true) {
            warn.push("돼지고기가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="복숭아" && state.peach==true) {
            warn.push("복숭아가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="토마토" && state.tomato==true) {
            warn.push("토마토가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="게" && state.gae==true) {
            warn.push("게가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="고등어" && state.high==true) {
            warn.push("고등어가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="조개류" && state.jo==true) {
            warn.push("조개류 "+food+"에서 검출되었어요!")
          }
          if (allergy=="오징어" && state.squid==true) {
            warn.push("오징어가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="잣" && state.jat==true) {
            warn.push("잣이 "+food+"에서 검출되었어요!")
          }
          if (allergy=="아황산" && state.wine==true) {
            warn.push("아황산류가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="호두" && state.brainnut==true) {
            warn.push("호두가 "+food+"에서 검출되었어요!")
          }
          if (allergy=="메밀" && state.memil==true) {
            warn.push("메밀이 "+food+"에서 검출되었어요!")
          }
          if (allergy=="땅콩" && state.nut==true) {
            warn.push("땅콩이 "+food+"에서 검출되었어요!")
          }
        }
      }
      setFoodListNum(temp);
      warn.sort();
      if (warn2!='') {
        Alert.alert(warn2,"식품 구매에 주의를 요합니다.")
      }
      if(warn.length==0) {
        Alert.alert("8가지 알레르기가 검출되지 않았습니다! :)");
      }
      else {
        Alert.alert("알레르기 검출!",warn.join("\n\n"));
      }
      Vibration.vibrate(400);
      NfcManager.cancelTechnologyRequest().catch(() => 0);
}

    return (
      <LinearGradient colors={['#FFAC9B', '#FFC7BF', '#FFD4CE']} style={styles.container}>
          <TouchableOpacity style={styles.button}
                 onPress={() => {
                  nfcRead(); //"칸타타프리미엄라떼&우유/"
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
                  state.egg = state.egg ? false : true;
                  console.log(state);
                }
                }
                isChecked = {state.egg}
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
                  state.cow = state.cow ? false : true;
                }
                }
                isChecked = {state.cow}
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
                  state.pig = state.pig ? false : true;
                }
                }
                isChecked = {state.pig}
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
                  state.chi = state.chi ? false : true;
                }
                }
                isChecked = {state.chi}
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
                  state.sae = state.sae ? false : true;
                }
                }
                isChecked = {state.sae}
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
                  state.gae = state.gae ? false : true;
                }
                }
                isChecked = {state.gae}
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
                  state.squid = state.squid ? false : true;
                }
                }
                isChecked = {state.squid}
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
                  state.high = state.high ? false : true;
                }
                }
                isChecked = {state.high}
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
                  state.jo = state.jo ? false : true;
                }
                }
                isChecked = {state.jo}
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
                  state.milk = state.milk ? false : true;
                }
                }
                isChecked = {state.milk}
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
                  state.nut = state.nut ? false : true;
                }
                }
                isChecked = {state.nut}
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
                  state.brainnut = state.brainnut ? false : true;
                }
                }
                isChecked = {state.brainnut}
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
                  state.jat = state.jat ? false : true;
                }
                }
                isChecked = {state.jat}
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
                  state.big = state.big ? false : true;
                }
                }
                isChecked = {state.big}
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
                  state.tomato = state.tomato ? false : true;
                }
                }
                isChecked = {state.tomato}
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
                  state.peach = state.peach ? false : true;
                }
                }
                isChecked = {state.peach}
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
                  state.mil = state.mil ? false : true;
                }
                }
                isChecked = {state.mil}
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
                  state.memil = state.memil ? false : true;
                }
                }
                isChecked = {state.memil}
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
                  state.wine = state.wine ? false : true;
                }
                }
                isChecked = {state.wine}
              />
            </ScrollView>
            <View style={styles.banner}>
              <Text style={{fontSize:15, fontWeight:'bold', color:'#FFEFEF'}}>{"\n"}당신의 알레르기 정보를 입력하여 주세요.</Text>
            </View>
        </View>   
        <Button 
            title = '{식품 리스트}'   
            onPress={() =>
              navigation.navigate('Details', {foods: foodListNum})
            }
          />          
      </LinearGradient> 
    );
}
function DetailsScreen( {route, navigation} ) {
  const report = async (food) => {
    var xhr = new XMLHttpRequest();
    var url = 'http://apis.data.go.kr/B553748/CertImgListService/getCertImgListService'; /URL/
    var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'4Es3IAYWvtEjQloH9aZivTA0FhZMzBQbDRsGvzwvSpWjQfBd%2BGkPTUj7TNeAltYbfnkZd%2BMPvvlwmdYPH%2FC%2BXw%3D%3D'; /Service Key/
    queryParams += '&' + encodeURIComponent('prdlstReportNo') + '=' + encodeURIComponent(food); //
    queryParams += '&' + encodeURIComponent('returnType') + '=' + encodeURIComponent('xml'); //
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); //
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /**/
    xhr.open('GET', url + queryParams);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
          var rawmtrl = (this.responseText).split("<rawmtrl>")[1].split("</rawmtrl>")[0].trim();
          rawmtrl = rawmtrl.replace(/\{[^}]*/g, "").replace(/[}]*/g, "").replace(/\([^)]*/g, "").replace(/[)]*/g, "").replace(/[^a-zA-Zㄱ-힣,]/g, "");
          rawmtrl = rawmtrl.split(",");
          
          var rmat = '';
          rawmtrl.forEach(element => {
            sheetOne.eachRow((row) => {
              if (row.getCell('i').value==element) {
                row.getCell('r').value += 1
                if (row.getCell('r')/row.getCell('c')>0.90) {
                  rmat += ',' + element;
                }
                //row.getCell('r').value=-100
              }
            })
          });
          sheetTwo.eachRow((row) => {
            console.log(row.values)
            if (row.getCell('u').value=='user') {
              row.getCell('d').value = rmat
            }
          })
        }
    };
    xhr.send('');
  }
  function picture(prdnm) {
    if (prdnm =='19720154001156') {
      return "https://img.danawa.com/prod_img/500000/951/529/img/1529951_1.jpg?shrink=330:330&_v=20200925092456"
    }
    else if (prdnm =='1991046110110') {
      return "http://image.nongshim.com/non/pro/1519720787073.jpg"
    }
    else if (prdnm =='1993044304663') {
      return "https://image.homeplus.kr/td/e41bc190-f987-4317-9bdd-bb235d50bb6a"
    }
    else {
      return "https://img.danawa.com/prod_img/500000/754/721/img/1721754_1.jpg?shrink=330:330&_v=20220913132343"
    }
  }
  /*report('1991046110110')
  report('2001054954120')
  report('19760342001184')
  report('19760342001184')*/
  const { foods } = route.params;
  return (
    <View style = {styles.ScreenBorder}>
      <View style = {styles.foodListScreen}>
        <FlatList 
          data = {foods}
          renderItem = {({item}) => {
              return (
                <View style = {styles.flextemp}>
                  <Image
                        style={{width: '25%', height: '100%', margin:0, marginTop:0, marginRight:0}}
                        source={{uri:picture(item[1])}}
                      />
                  <TouchableOpacity
                    style = {styles.listOfFood}
                    onPress={() => {
                      report(item[1])
                      Alert.alert("(!) 신고가 완료되었습니다.")
                    }}
                  >
                    <Text style = {styles.food}>{item[0]}</Text>
                  </TouchableOpacity>
                </View>
              )
          }}
          keyExtractor = {(item) => item.id}
        />
        <Button title = 'Home' onPress = {() => {navigation.navigate('Home')}} />
      </View>
    </View>
      
  );
}
const Screen = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Screen.Navigator>
        <Screen.Screen 
          name="Home" 
          component={HomeScreen} 
          options = {{
            title : 'Home',
          }}
        />
        <Screen.Screen 
          name="Details" 
          component={DetailsScreen}
          options = {{
            title : 'Food List'
          }}
        />
      </Screen.Navigator>
    </NavigationContainer>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    borderBottomLeftRadius: 20,
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
  },
  ScreenBorder : {
    flex:1,
    backgroundColor : '#FFDAAF',
  },
  listOfFood : {
    margin:10,
    marginLeft:5,
    paddingLeft:5,
    paddingBottom : 20,
    paddingTop:30,
    paddingRight:5,
    //borderBottomWidth : 3,
    //borderBottomColor: "#FF653A",
    //backgroundColor : '#FFF2E5',
  },
  food : {
    fontSize : 20,
  },
  foodListScreen : {
    margin:5,
    padding:10,
    backgroundColor : '#F2F2F2',
    borderRadius: 20,
    flex : 1,
  },
  flextemp : {
    marginTop : 5,
    marginRight : 10,
    marginLeft : 0,
    paddingRight:5,
    flexDirection: 'row',
    backgroundColor : '#FFFFFF',
  }

});

export default App;