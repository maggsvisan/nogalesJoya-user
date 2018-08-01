import React, { Component } from 'react';
import { Table, Button, Modal, Icon } from 'react-materialize';
import DropdownScreen from '../DropdownScreen/DropdownScreen';

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

class PromoLoop extends Component {

    state = {
        screenName: 'Screen 1',
        daySelected: 'Lunes',
        schedules: [],
        showResults: false,
        screenList: [],
        screens: []
    }

    componentDidMount() {

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
        this.setState({ showResults: true});
        const daySelected= this.state.daySelected;
        let screenName2 = this.state.screenName;

        const dayIndex = daysName.find(day => day.name === daySelected).key;
        screenName2= screenName2.replace(" ",""); 
       
        firebaseApp.database().ref(`Scheduler/${screenName2}/${dayIndex}`)
            .on('value', (data) => {
                let values = data.val();
                this.setState({ schedules: values });

            }, (err) => {
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
                            <p className="titleHead"> Seleccione día </p>
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
                                            <th> Horario </th>
                                            <th> Video </th>
                                            <th>Inicio </th>
                                            <th>Fin</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            Object.entries(this.state.schedules).map(([key, schedule]) => (
                                                <tr key={key}>
                                                    <td> {key} </td>
                                                    <td> {schedule.VideoName} </td>
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
                            Ver
                        </Button>

                    </div>
                </div>
            </div>

        )
    }
}
export default PromoLoop;



