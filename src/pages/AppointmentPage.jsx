import { useState, useEffect } from "react";
import { useForm } from "antd/es/form/Form";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import AppointmentForm from "../components/AppointmentForm";
import {
  FileOutlined,
  UnorderedListOutlined,
  FileAddOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  theme,
  Typography,
  Table,
  Modal,
  Button,
  message,
} from "antd";

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

const AppointmentPage = () => {
  const { id } = useParams(); // Extract the ID from the URL params
  const [form] = useForm();
  const [dataSource, setDataSource] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Table columns
  const columns = [
    {
      title: "Firstname",
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "Lastname",
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Appointment Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Appointment Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => {
        return (
          <>
            <Link
              to={`/home/edit/${record.id}`}
              state={{ appointment: record }}
            >
              <EditOutlined />
            </Link>
            <DeleteOutlined
              onClick={() => {
                onDeleteAppointment(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  useEffect(() => {
    const storedDataSource = window.localStorage.getItem("dataSource");
    if (storedDataSource && storedDataSource.length) {
      setDataSource(JSON.parse(storedDataSource));
    }
  }, []);

  useEffect(() => {
    if (dataSource.length) {
      localStorage.setItem("dataSource", JSON.stringify(dataSource));
    }
  }, [dataSource]);

  const onFinish = (values) => {
    handleOnFinish(values);
  };

  const onAddAppointment = () => {
    setOpenModal(true);
  };

  const closeAppointmentModal = () => {
    setOpenModal(false);
    form.resetFields();
  };

  const onDeleteAppointment = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete the appointment record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        message.success("Deleted Successfully");
        setDataSource((pre) => {
          const updatedDataSource = pre.filter(
            (appointment) => appointment.id !== record.id
          );
          localStorage.setItem("dataSource", JSON.stringify(updatedDataSource));
          return updatedDataSource;
        });
      },
    });
  };

  const handleOnFinish = (values) => {
    const updatedAppointment = {
      id,
      ...values,
      date: dayjs(values.date).format("YYYY-MM-DD"),
      time: dayjs(values.time).format("h:mm A"),
    };

    // Retrieve the data source from local storage
    const storedDataSource =
      JSON.parse(localStorage.getItem("dataSource")) || [];

    if (id) {
      // If ID exists, update the appointment in the data source
      const updatedDataSource = storedDataSource.map((appointment) => {
        if (appointment.id === updatedAppointment.id) {
          return updatedAppointment;
        }
        return appointment;
      });

      // Update the data source in local storage
      localStorage.setItem("dataSource", JSON.stringify(updatedDataSource));

      message.success("Appointment updated successfully!");
    } else {
      // If ID doesn't exist, generate a new ID using uuid
      const newAppointment = { ...updatedAppointment, id: uuid() };
      const newDataSource = [...storedDataSource, newAppointment];
      setDataSource(newDataSource);

      // Update the data source in local storage
      localStorage.setItem("dataSource", JSON.stringify(newDataSource));
      message.success("Appointment added successfully!");
    }
    form.resetFields();
    closeAppointmentModal();
  };

  return (
    <>
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
              <Title style={{ textAlign: "center", fontWeight: "bold" }}>
                DX LANG MAY MEDICAL APPOINTMENT
              </Title>

              <Button onClick={onAddAppointment} type="primary">
                ADD APPOINTMENT
              </Button>
              <div style={{ overflowX: "auto" }}>
                <Table columns={columns} dataSource={dataSource} />
              </div>
              <Modal
                title="Appointment"
                open={openModal}
                onCancel={() => {
                  closeAppointmentModal();
                }}
                footer={null}
              >
                <AppointmentForm form={form} onFinish={onFinish} />
              </Modal>
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};
export default AppointmentPage;
