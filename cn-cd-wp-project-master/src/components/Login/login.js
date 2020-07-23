import React from "react";
import "./login.scss"
// reactstrap components
import {
 // UncontrolledCollapse,
  //NavbarBrand,
  //NavItem,
  //NavLink,
  //Nav,
  //Container,
  //Row,
  Alert,
  Col,
  Row,
  CardBody,
  CardTitle,
  Button,
  InputGroup,
  Input
} from "reactstrap";

class Login extends React.Component {
    render() {
        return (
            <div className='row-line' id='login-window' >  
                <Row>   
                    <Col  className='blog column'>
                        	{/* <div class = 'wrapper'>
                                <div class = 'card'>
                                    <div class = 'front'>
                                        <img src = 'https://images.unsplash.com/photo-1529408686214-b48b8532f72c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=986e2dee5c1b488d877ad7ba1afaf2ec&auto=format&fit=crop&w=1350&q=80'></img>
                                    </div>
                                </div>
                            </div> */}
                            {/* <div class="col-md-3 col-sm-4 col-8 flip-box">
                                <div class="front" id='network'>
                                    <div class="content text-center">
                                    COMPUTER<br/>NETWORKS
                                    <span class="click-for-more">
                                    </span>
                                    </div>
                                </div>
                                <div class="back">
                                    <div class="content">
                                    Sockets.io <br/>
                                    webRTC
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-4 col-8 flip-box">
                                <div class="front" id='compiler'>
                                    <div class="content text-center">
                                    COMPLIER<br/>DESIGN
                                    <span class="click-for-more">
                                    </span>
                                    </div>
                                </div>
                                <div class="back">
                                    <div class="content">
                                    First Back
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-4 col-8 flip-box"> */}
                                {/* <div class="front" id='web'>
                                    <div class="content text-center">
                                    WEB<br/>
                                    <span class="click-for-more">
                                    </span>
                                    </div>
                                </div>
                                <div class="back">
                                    <div class="content">
                                    HTML <br/> CSS <br/> REACTJS
                                    </div>
                                </div>
                            </div> */}
                            <br></br>
                            <br></br>
                            <Row>
                                <Col md='2' sm ='2' lg ='4'>
                                    <div class="flip-box">
                                        <div class="front" id='web'>
                                            <div class="content text-center">
                                            WEB<br/>
                                            <span class="click-for-more">
                                            </span>
                                            </div>
                                        </div>
                                        <div class="back">
                                            <div class="content">
                                            HTML <br/> CSS <br/> REACTJS
                                            </div>
                                        </div>
                                    </div>
                                    
                                </Col>
                                <Col md='2' sm ='2' lg ='4' >
                                    <div class=" flip-box">
                                    <div class="front" id='compiler'>
                                        <div class="content text-center">
                                        COMPLIER<br/>DESIGN
                                        <span class="click-for-more">
                                        </span>
                                        </div>
                                    </div>
                                    <div class="back">
                                        <div class="content">
                                        NLTK
                                        <br/>
                                        
                                        </div>
                                    </div>
                                    </div>
                                </Col>
                                <Col md='2' sm ='2' lg ='4' >
                                    <div class=" flip-box">
                                    <div class="front" id='network'>
                                        <div class="content text-center">
                                        COMPUTER<br/>NETWORKS
                                        <span class="click-for-more">
                                        </span>
                                        </div>
                                    </div>
                                    <div class="back">
                                        <div class="content">
                                        Sockets.io <br/>
                                        webRTC
                                        </div>
                                    </div>
                                    </div>
                                </Col>
                            </Row>
                    </Col>


            <Col lg='3' md='3' sm='3' className='left-col' >
                <br/>
                <br/>
                    <CardBody>
                        <div className='text-center'>
                        <CardTitle className='head-line color-white'>Create-Room</CardTitle>

                        </div>
                        
                        
 
                        <InputGroup >
                            <Input classname='input-area w-50' type='text' placeholder="Room Name" id='room-name'/>
                        </InputGroup>
                        <br/>
                        <InputGroup>
                            <Input type='text' classname='input-area' placeholder="Your Name" id='your-name'/>
                        </InputGroup>
                        <br/>
                        <div className="text-center">
                  <Button className="mt-4" color="info" type="button" id='create-room'>
                    Create Room
                  </Button>
                  
                </div>
                    </CardBody>
                        <Alert color="danger" id='err-msg-box'hidden>
                            <span class="form-text small text-danger" id='err-msg'></span>
                        </Alert>
                        <div class="" id='room-created'></div>
            </Col>
            </Row> 
            </div>
 
        );
    }
}

export default Login;
