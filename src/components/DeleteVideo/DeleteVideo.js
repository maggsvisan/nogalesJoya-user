import React, { Component } from 'react';
import DropdownScreen from '../DropdownScreen/DropdownScreen';
import {Button, Modal, Icon} from 'react-materialize';
import './DeleteVideo.css';

import 'firebase/database';
import firebaseApp from '../../firebase/firebaseApp';

let storageRef;
let logFilesRef;
let gralInventory;
let screenName2;
let initialVideos;
let arrayScreens= [];
let arrayRootDirectory =[];
let arrayVideos = [];


class DeleteVideo extends Component {
    state = {
        selectedVideo: null,
        screenName: "Screen1",
        showResults: false,
        videos: [],
        videos2: [],
        deleteVideo: '',
        deleteVideoRoot: '',
        screens: [],
        screenList: [],
        videoRootDir: [],
        videoList: []
    }

    handleVideoChange = (name, value,key) => {
        console.log("keykey", key);
        console.log("the value", value);
        this.setState({ deleteVideo: value});
    }

    handleVideoRootChange = (name, value) => {
        console.log("dropdownDEl", this.state.deleteVideoRoot);
        this.setState({ deleteVideoRoot: value});
    }
    
    componentDidMount() {
        storageRef= firebaseApp.storage().ref();
        logFilesRef= firebaseApp.database().ref().child("Inventory");
        gralInventory= firebaseApp.database().ref().child("General_Inventory");
        screenName2 = this.state.screenName;
        screenName2= screenName2.replace(" ",""); 
        
        let videoName2 = "";
        let initialVideos2;
        let initialVideos3;
        let videoName3;

        let defaultRootVideos;
        let newValRoot;

        // set SET DEFAULT VALUES for first screen //
        firebaseApp.database().ref(`Inventory/${screenName2}/`) //first value for dropdowns, screen1
        .orderByKey().limitToFirst(1).once('value', function(snap) {
            let newVal= snap.val();
            Object.keys(newVal).forEach((key, index) => {
                initialVideos2 =newVal[key];    
            })    
        }).then((dataSnapshot) => {
            this.setState({deleteVideo: initialVideos2.name});
        });

        firebaseApp.database().ref(`General_Inventory/`) //first value for dropdowns, screen1
        .orderByKey().limitToFirst(1).once('value', function(snap) {
            newValRoot= snap.val();
            Object.keys(newValRoot).forEach((key, index) => {
                defaultRootVideos =newValRoot[key];   
            })    
        }).then((dataSnapshot) => {
            this.setState({deleteVideoRoot: defaultRootVideos.name});
        });
        // set SET DEFAULT VALUES for first screen //

        // SET DYNAMIC DROPDOWNS //
        firebaseApp.database().ref(`Inventory/${screenName2}/`) // videos per screen
        .on('value', (data) => {
              let values = data.val();
              this.setState({ videos: values }, () => {
                arrayVideos = [];
                arrayScreens = [];
                Object.keys(this.state.videos).forEach((key, index) => {
                    initialVideos = this.state.videos[key]
                    videoName2= initialVideos.name;
                    arrayVideos.push({name: videoName2, key:key});  
                    this.setState({videoList: arrayVideos }) ; 
              }
            );
            });
          }, (err) => {
              console.log(err);
          });
          
          firebaseApp.database().ref(`Inventory`)  // show all screens in dynamic dropdown
          .on('value', (data) => {
              let values = data.val();
              arrayScreens=[];
              this.setState({ screens: values }, () => {
                Object.keys(this.state.screens).forEach((key, index) => {
                    arrayScreens.push({name: key, key:index});    
                    this.setState({screenList: arrayScreens });       
              }
            );
         
            });

          }, (err) => {
              console.log(err);
          });

          

          firebaseApp.database().ref(`General_Inventory/`) //all videos root directory
          .on('value', (data) => {
              let values = data.val();
              this.setState({ videos2: values }, () => {   
                arrayRootDirectory =[];
                Object.keys(this.state.videos2).forEach((key, index) => {
                    initialVideos3 = this.state.videos2[key]
                    videoName3= initialVideos3.name;
                    arrayRootDirectory.push({name: videoName3, key:key});  
                    this.setState({videoRootDir: arrayRootDirectory }) ;      
                    });
               });
           
            }, (err) => {
              console.log(err);
          });   
         // SET DYNAMIC DROPDOWNS //        
    }

    deleteRootDirectory = () =>{
        let videoStorage;
        let video2delete=  this.state.deleteVideoRoot;
        videoStorage = video2delete.replace("(", "_");
        videoStorage = videoStorage.replace(")","_");
        videoStorage = videoStorage.replace(/ /g,"_");
        var desertRef = storageRef.child(`Videos/${videoStorage}`);

        //eliminar el archivo y borrarlo destorage a db
        desertRef.delete().then(function() {
            gralInventory.orderByChild('name').equalTo(video2delete).once('value').then(function(snapshot) { 
                //console.log("the key is ",snapshot.key);
                //console.log("snapshot.val()",snapshot.val());
                let key = Object.keys(snapshot.val())[0]; //timestamp fb_key
                gralInventory.child(key).remove();
                alert(`${videoStorage} deleted!`); 
                window.location.reload();   
                
            }).catch(function(error) {
                // Uh-oh, an error occurred!
                    console.log(error);
            });
            
        })
        .catch(function(error) {
            // Uh-oh, an error occurred!
                alert("Video not found");
        });
               
    }

    deleteVideo = () => {  
        if (this.state.deleteVideo === null){
            alert("Please, select a video to delete");
        }

        else {
            screenName2 = this.state.screenName;
            screenName2= screenName2.replace(" ",""); 
            let video2delete=  this.state.deleteVideo;
            console.log("video to delete", this.state.deleteVideo);

            logFilesRef.child(`${screenName2}`).orderByChild('name').equalTo(video2delete).once('value').then(function(snapshot) {  
                //console.log("the key is ",snapshot.key);
                let key = Object.keys(snapshot.val())[0];
                logFilesRef.child(`${screenName2}`).child(key).remove();
                alert(`Deleted: ${video2delete} from ${screenName2}` );

            }).catch(function(error) {
                // Uh-oh, an error occurred!
                 console.log(error);
            }); 
        }
       window.location.reload();
    }

    handleScreenChange = (name, value) => {
        let videoName2 = "";
        arrayVideos = [];
        this.setState({ screenName: value});
        screenName2 = value;
        screenName2= screenName2.replace(" ",""); 

        firebaseApp.database().ref(`Inventory/${screenName2}/`)
        .on('value', (data) => {
          arrayVideos = [];
            let values = data.val();
            this.setState({ videos: values }, () => {
             
              Object.keys(this.state.videos).forEach((key, index) => {
                  initialVideos = this.state.videos[key]
                  videoName2= initialVideos.name;
                  arrayVideos.push({name: videoName2, key: key});    
                  this.setState({videoList: arrayVideos }) ; 
            }
          );
       
          });

        }, (err) => {
            console.log(err);
        });

    }


    filesSelectedHandler = (event) => {
      
       this.setState({
           selectedVideo: event.target.files[0]
       })

    }

  
    render() {

        return (

            <div className="PromoLoop" >
               
                <div>
                    <h2 className="headerScheduler"> Delete Videos </h2> 

                    <span className="modalScheduler">
                            <Modal 
                            header='Modal Header'
                            trigger={<Button waves='light'>Help!<Icon right> help </Icon></Button>}>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.</p>
                            <br/>
                            </Modal>
                            <br/>
                    </span>
                
                </div>

                <div className="addBorder1">
                    <div className="row">
                        <div className="col s12">
                            <h5> Select video to delete from root directory </h5>
                        </div>
                        <div className=" col s6">                  
                            <p className="titleHead"> Select video to delete </p>
                                <DropdownScreen 
                                    handleChange={this.handleVideoRootChange}
                                    name="video"
                                    items={this.state.videoRootDir}
                                />  
                            <br/>
                        </div>

                        
                        <div className="col s6">
                                <Button className= "alignBtn" onClick={() => {
                                                this.deleteRootDirectory();
                                                
                                            }}
                                        >Delete Video </Button>     
                        </div>
                    </div> 
                </div>  

                <div className="row">
                    <div className="col s12">
                    </div>
                </div>

                <div className="addBorder2">
                    <div className="row">
                        <div className="col s12">
                            <h5> Select video to delete from a screen </h5>
                            <div className=" col s6">
                                <p className="titleHead"> Select a screen </p>
                                <DropdownScreen 
                                    handleChange={this.handleScreenChange}
                                    name="video"
                                    items={this.state.screenList}
                                />
                            </div>

                            <div className=" col s6">                  
                            <p className="titleHead"> Select video to delete </p>
                                <DropdownScreen 
                                    handleChange={this.handleVideoChange}
                                    name="video"
                                    items={this.state.videoList}
                                />  
                            <br/>
                            </div>
                            <Button onClick={() => {this.deleteVideo(); }} >Delete Video </Button>     
                        </div>
                    </div>  
                </div>           
  
            </div>
        )
    }
}
export default DeleteVideo;



