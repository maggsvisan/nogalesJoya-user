import React, { Component } from 'react';
import './Scheduler.css';
import SchedulerContent from '../ScheduleContent/ScheduleContent'
import { Collapsible, CollapsibleItem, Modal, Button, Icon } from 'react-materialize';


const Days = [
    { name: "Lunes", key: 0 },
    { name: "Martes", key: 1 },
    { name: "Miércoles", key: 2 },
    { name: "Jueves", key: 3 },
    { name: "Viernes", key: 4 },
    { name: "Sábado", key: 5 },
    { name: "Domingo", key: 6 }
]

class Scheduler extends Component {
    render() {
        return (
            <div className="Scheduler" >
                <div className="row"> 
                    <div className="col s12">
                        <h2 className="headerScheduler"> Horario </h2> 
                    </div>
                </div>

                <Collapsible>
                    
                    {Days.map(({ name, key }) => (
                        <CollapsibleItem
                            key={key}
                            header={name}
                            icon='toc'>
                            <SchedulerContent dayIndex={key}
                                updateScheduler={this.props.updateScheduler}
                                setNewTrigger={this.props.setNewTrigger}
                                handleSubmit={this.props.submitSchedules}
                                schedulerSection={this.props.schedulerSection}
                                getDayOfWeek={this.props.getDayOfWeek} />
                        </CollapsibleItem>
                    ))}

                </Collapsible>
            </div>
        )
    }
}
export default Scheduler;
