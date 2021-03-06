import React, { Component } from 'react';
import { Table, Button, Modal, Icon } from 'react-materialize';
import DropdownScreen from '../DropdownScreen/DropdownScreen';
import TimerMixin from 'react-timer-mixin';

import './QuickViewSchedule.css';
import firebaseApp from '../../firebase/firebaseApp';

const daysName = [
    { name: 'Lunes', key: 0 },
    { name: 'Martes', key: 1 },
    { name: 'Miércoles', key: 2 },
    { name: 'Jueves', key: 3 },
    { name: 'Viernes', key: 4 },
    { name: 'Sábado', key: 5 },
    { name: 'Domingo', key: 6 },
];

let arrayScreens= [];
let screenName2;
let dayIndex;
let schedulerRef;
let arraySchedules= [];


class QuickViewSchedule extends Component {

    state = {
        screenName: 'Screen 1',
        daySelected: 'Lunes',
        schedules: [],
        showResults: false,
        screenList: [],
        screens: []
    }

   
    componentDidMount() {
        TimerMixin.setTimeout(
            () => { console.log('I do not leak!'); },
            5000
        );
        
        schedulerRef= firebaseApp.database().ref().child("Scheduler");
        arraySchedules= [];

        firebaseApp.database().ref(`Inventory`) //screens
        .on('value', (data) => {
            let values = data.val();
            arrayScreens=[];
            this.setState({ screens: values }, () => {
              Object.keys(this.state.screens).map((key, index) => {
                  arrayScreens.push({name: key, key:index}); 
                  this.setState({screenList: arrayScreens }); 
                  return arrayScreens;
             }
          );
          });

        }, (err) => {
            console.log(err);
        });
    }

    showSchedules = () => {
        arraySchedules= [];
        this.setState({ showResults: true});
        const daySelected= this.state.daySelected;
        screenName2 = this.state.screenName;

        dayIndex = daysName.find(day => day.name === daySelected).key;
        screenName2= screenName2.replace(" ",""); 
       
        firebaseApp.database().ref(`Scheduler/${screenName2}/${dayIndex}`)
            .on('value', (data) => {
                let values = data.val();
                console.log("schedule values", values);

                console.log("the videoname is",values.schedule1);

                Object.keys(values).forEach((key, index) => {
                    let theValues;
                    theValues= values[key];
                    console.log("Key",theValues); 
                    console.log("videoName", theValues.VideoName); 

                    if(theValues.VideoName !== "0"){
                        console.log(`entra ${theValues.VideoName}`)
                        let videoPush= theValues.VideoName;
                        let startPush= theValues.startTime;
                        let endPush= theValues.endTime;
                        let keyPush= key.slice(-1);

                        console.log("THE KEY TO PUSH",keyPush);
                        
                        console.log("videoPush",videoPush);
                        console.log("videoPush",startPush);
                        console.log("videoPush",endPush);
                        //this.setState({ schedules: values });
                        arraySchedules.push({name:videoPush, startTime: startPush, endTime:endPush, scheduleKey:keyPush , key: key})
                         
                    }
                    
                })
                //this.setState({ schedules: values });
                console.log("to render",arraySchedules);
                this.setState({ schedules: arraySchedules });

            }
            
            , (err) => {
                console.log(err);
            });
    }

    handleDayChange = (name, value) => {
        this.setState({ daySelected: value });
    }

    handleScreenChange = (name, value) => {
        this.setState({ screenName: value });

    }

    handleChangeToAll = () => {
        this.setState({ screenName: "all" });
    }

    removeSchedule = (theKey) => {
        arraySchedules=[];

        firebaseApp.database().ref(`Scheduler/${screenName2}/${dayIndex}/schedule${theKey}`)
        .on('value', (data) => {
            let values2 = data.val();        
            schedulerRef.child(`${screenName2}/${dayIndex}/schedule${theKey}`).update({
                "VideoName": '0',
                "startTime": '0',
                "endTime": '0', 
            }).then(()=>{
                window.location.reload();
            })
        }, (err) => {
            console.log(err);
        });

        
    }

    renderObject = (values) => {
        return Object.entries(values).map(([key, value], i) => {
            return (
                <div key={key}>
                    videoname is: {value.VideoName};
					startTime is: {value.startTime};
				</div>
            )
        })
    }

    render() {
        return (
            <div className="QuickViewSchedule" >

                <div>
                    <h2 className="headerScheduler"> Ver Horario </h2>
                </div>

                <div className="row">
                    

                    <div className="col s12">
                        <div className="selectScreenQS">
                            <p className="titleHead"> Seleccione día</p>
                            <DropdownScreen
                                handleChange={this.handleDayChange}
                                name="video"
                                items={daysName}
                            />
                        </div>
                    </div>
                </div>
                
                { this.state.showResults ? (
                    <div className="row">
                            <div className="pageCenter">
                                <Table className="quickTable">
                                    <thead>
                                        <tr>
                                            <th> </th>
                                            <th> Horario </th>
                                            <th> Video </th>
                                            <th> Inicio </th>
                                            <th> Fin </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            Object.entries(this.state.schedules).map(([key, schedule]) => (
                                                
                                                <tr key={key}>
                                                    <td>  
                                                    <Button
                                                            onClick={() => this.removeSchedule(schedule.scheduleKey)}
                                                            type="submit"
                                                            value="Submit"
                                                        >
                                                            Quitar
                                                        </Button>
                                                    </td>
                                                    <td> {schedule.scheduleKey} </td>
                                                    <td> {schedule.name} </td>
                                                    <td> {schedule.startTime} </td>
                                                    <td> {schedule.endTime} </td>
                                                </tr>

                                            ))
                                        }
                                    </tbody>

                                </Table>
                            </div>
                     </div>) : <br/>
                }


                <div className="row">
                    <div className="col12">
                        <Button
                            onClick={() => this.showSchedules()}
                            type="submit"
                            value="Submit"
                        >
                            Mostrar
                        </Button>

                    </div>
                </div>
            </div>

        )
    }
}
export default QuickViewSchedule;



