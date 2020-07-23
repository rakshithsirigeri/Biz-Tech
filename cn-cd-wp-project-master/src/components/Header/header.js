import React from "react";
//import { Link } from "react-router-dom";
import "./header.css"
// reactstrap components
import {
 // UncontrolledCollapse,
  //NavbarBrand,
  Navbar,
  //NavItem,
  //NavLink,
  //Nav,
  //Container,
  //Row,
  Col
//  Row,
  //Container
} from "reactstrap";

class header extends React.Component {
  render() {
    return (
      <>
        <Navbar
        className="App-nav"
        class='col-md-12 col-lg-12 col-sm-12'
        id="navbar">
        
                <Col md='8' xs ='6' id="Shown-col">
                  <img  src={require("../../assets/images/headphone.jpg")} id="App-logo" alt=""/>
                  <span className="App-name" >FIZ BIZ</span>
                </Col>

                <Col md='4' xs ='6' className="room-comm justify-content-end" hidden id='Hidden-room'>
                  <button class="btn btn-sm rounded-0 btn-no-effect" id='toggle-video'>
                      <i class="fa fa-video text-white"></i>
                  </button>
                  <button class="btn btn-sm rounded-0 btn-no-effect" id='toggle-mute'>
                      <i class="fa fa-volume-up text-white" id='toggle-mute'></i>
                  </button>
                  <button class="btn btn-sm text-white pull-right d-md-none btn-no-effect" id='toggle-chat-pane'>
                      <i class="fa fa-comment"></i> <span class="badge badge-danger very-small font-weight-lighter" id='new-chat-notification' hidden>New</span>
                  </button>
                  <button class="btn btn-sm rounded-0 btn-no-effect text-white" id='leave-room'>
                      Leave Room
                  </button>
                </Col>         
        </Navbar>
      </>
    );
  }
}

export default header;
