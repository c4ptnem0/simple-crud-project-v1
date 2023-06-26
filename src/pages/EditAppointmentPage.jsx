import { Link, useLocation } from "react-router-dom";
import React from "react";
import {
  FileOutlined,
  UnorderedListOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Typography, Button, message } from "antd";
import AppointmentForm from "../components/AppointmentForm";
import { useForm } from "antd/es/form/Form";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const items = [
  getItem("Create Appointment", "1", <FileAddOutlined />),
  getItem("Appointment Lists", "2", <UnorderedListOutlined />),
  getItem("Files", "9", <FileOutlined />),
];

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const EditAppointmentPage = (props) => {
  const { id } = useParams(); // Extract the ID from the URL params
  const [form] = useForm();
  const location = useLocation();

  console.log(props, "props");
  console.log(location, " useLocation Hook");
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onFinish = (values) => {
    handleOnFinish(values);
  };

  const handleOnFinish = (values) => {
    const updatedAppointment = {
      id,
      ...values,
      date: dayjs(values.date).format("YYYY-MM-DD"),
      time: dayjs(values.time).format("h:mm A"),
    };

    // get the dataSource item in the Local Storage, then update its values
    const storedDataSource = JSON.parse(localStorage.getItem("dataSource"));
    const updatedDataSource = storedDataSource.map((appointment) => {
      if (appointment.id === updatedAppointment.id) {
        return updatedAppointment;
      }
      return appointment;
    });

    localStorage.setItem("dataSource", JSON.stringify(updatedDataSource));

    message.success("Updated appointment successfully!");
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          background: colorBgContainer,
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="light"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />
        <Content
          style={{
            margin: "16px 16px",
          }}
        >
          <div
            style={{
              padding: 20,
              background: colorBgContainer,
            }}
          >
            <Title style={{ textAlign: "center", fontWeight: "bold" }}></Title>
            <Link to="/home">
              <Button>GO BACK</Button>
            </Link>
            <AppointmentForm form={form} onFinish={onFinish} />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default EditAppointmentPage;
