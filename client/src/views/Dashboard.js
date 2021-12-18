import { PostContext } from "../contexts/PostContext"
import { AuthContext } from "../contexts/AuthContext"
import { useContext, useEffect } from "react"
import Card from "react-bootstrap/Card"
import Spinner from "react-bootstrap/Spinner"
import Button from "react-bootstrap/Button"
import Row from "react-bootstrap/Row"
import Toast from "react-bootstrap/Toast"
import Col from "react-bootstrap/Col"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"
import SinglePost from "../components/post/SinglePost"
import addIcon from "../assets/plus-circle-fill.svg"
import AddPostModal from "../components/post/AddPostModal"
import UpdatePostModal from "../components/post/UpdatePostModal"
const Dashboard = () => {
  const {
    postState: {post, posts, postsLoading },
    getPosts,
    setShowAddPostModal,
    showToast: { show, message, type },
    setShowToast,
  } = useContext(PostContext)

  const {
    authState: {
      user: { username },
    },
  } = useContext(AuthContext)
//eslint-disable-next-line
  useEffect(() => getPosts(), [])

  let body = null

  if (postsLoading) {
    body = (
      <div className="spinner-container">
        <Spinner animation="border" variant="info" />
      </div>
    )
  } else if (posts.length === 0) {
    body = (
      <>
        <Card className="text-center mx-5 my-5">
          <Card.Header as="h1">Hi {username}</Card.Header>
          <Card.Body>
            <Card.Title> Wellcome to Learn It</Card.Title>
            <Card.Text>
              Click the button below to track your first skill to learn
            </Card.Text>
            <Button variant="primary" onClick={setShowAddPostModal.bind(true)}>LearnIt</Button>
          </Card.Body>
        </Card>
      </>
    )
  } else {
    body = (
      <>
        <Row className="row-cols-1 row-cols-md-3 g-4 mx-auto mt-3">
          {posts.map(post => (
            <Col key={post._id} className="my-2">
              <SinglePost post={post}/>
            </Col>
          ))}
        </Row>
        <OverlayTrigger
          placement="left"
          overlay={<Tooltip>Add a new post</Tooltip>}
        >
          <Button
            className="btn-floating"
            onClick={setShowAddPostModal.bind(this, true)}
          >
            <img src={addIcon} alt="add-post" width="60" height="60" />
          </Button>
        </OverlayTrigger>
      </>
    )
  }

  return (
    <>
      {body}
      <AddPostModal />
      {post !==null &&< UpdatePostModal/>}
      <Toast
        show={show}
        style={{ position: "fixed", top: "20%", right: "10px" }}
        className={`bg-${type} text-white`}
        onClose={setShowToast.bind(this, {
          show: false,
          message: "",
          type: null, 
        })}
        delay={3000}
        autohide
      >
        <Toast.Body>
          <strong>{message}</strong>
        </Toast.Body>
      </Toast>
    </>
  )
}
export default Dashboard
