import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
const About = () => {
    return (
        <Row className='mt-5' style={{marginRight:0}}>  
            <Col className='text-center' >
                    <Button 
                    variant='primary'
                    href='https://youtube.com'
                    size='lg'
                    >
                       youtube
                    </Button>
            </Col>
        </Row>

    )
}
export default About