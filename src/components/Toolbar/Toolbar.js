import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import './Toolbar.css';
import Scheduler from '../Scheduler/Scheduler';
import Announcements from '../Announcements/Announcements';
import PromoLoop from '../PromoLoop/PromoLoop';
import PowerSettings from '../PowerSettings/PowerSettings';
import ProofPlaying from '../ProofPlaying/ProofPlaying';
import QuickViewSchedule from '../QuickViewSchedule/QuickViewSchedule';
import Home from '../Home/Home';
import UploadVideo from '../UploadVideo/UploadVideo';
import MyProfile from '../MyProfile/MyProfile';
import DeleteVideo from '../DeleteVideo/DeleteVideo';
import StorageView from '../StorageView/StorageView';
import firebase from 'firebase';

import { Icon, Button, SideNav, SideNavItem } from 'react-materialize';

class Toolbar extends Component {
  
  constructor(props){
    super(props);

    this.logout = this.logout.bind(this);
  }

  logout() {
    console.log("Hi Logout!")
    firebase.auth().signOut();
  }

  render() {
    return (
      <Router>
        <span className= "Toolbar">
        <SideNav  
          trigger={<Button className="sideMenuButton" > <Icon className="material-icons left"> dehaze </Icon> Menu  </Button>}
          options={{ closeOnClick: true }}
          >
          
          <SideNavItem subheader>Funciones</SideNavItem>

          <li>
             <Link to="/scheduler"><Icon className="material-icons left">access_time</Icon> Horario </Link>
          </li>
          
          <li>
              <Link to="/QuickViewSchedule"><Icon className="material-icons left">view_list</Icon> Ver Horario</Link>
          </li>

          <li>
            <Link to="/announcements"><Icon className="material-icons left">access_alarm</Icon> Anuncios</Link>
          </li>
        
          <li>
              <Link to="/loopPromo"><Icon className="material-icons left">cached</Icon> Promociones </Link>
          </li>
        
          <li>
            <Button onClick={this.logout}> Logout </Button>
          </li>        
        
        </SideNav>


          <hr />

          <Switch>
          <Route exact path="/" render={() => <Home/>}
          />
                  
          <Route exact path="/scheduler" render={() => <Scheduler
              verifyDayOfWeek={this.props.verifyDayOfWeek}
              submitSchedules={this.props.submitSchedules}
              updateScheduler={this.props.updateScheduler}
              schedulerSection={this.props.schedulerSection} />}
            />
            
            <Route exact path="/quickViewSchedule" render={() => <QuickViewSchedule/>}
            />            
           
            <Route exact path="/announcements" render={() => <Announcements />}
            />

            <Route exact path="/loopPromo" render={() => <PromoLoop />}
            />

          
          </Switch>       
        </span>
      </Router>
    )
  }
}

export default Toolbar;