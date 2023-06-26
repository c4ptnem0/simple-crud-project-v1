import { useEffect } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  message,
} from "antd";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
    style: {
      textAlign: "right", // Add this CSS property
    },
  },
};

const EditAppointmentForm = ({ form }) => {
  const { id } = useParams(); // Extract the ID from the URL params

  useEffect(() => {
    const appointment = JSON.parse(localStorage.getItem("dataSource")).find(
      (appointment) => appointment.id === id
    );

    if (appointment) {
      form.setFieldsValue({
        firstname: appointment.firstname,
        lastname: appointment.lastname,
        address: appointment.address,
        reason: appointment.reason,
        date: dayjs(appointment.date),
        time: dayjs(appointment.time, "h:mm A"),
      });
    }
  }, [id, form]);

  const onFinish = (values) => {
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
    <>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        style={{
          maxWidth: 600,
        }}
        scrollToFirstError
      >
        <Form.Item
          name="firstname"
          label="Firstname"
          rules={[
            {
              required: true,
              message: "Please input your firstname!",
            },
          ]}
        >
          <Input placeholder="Enter firstname" />
        </Form.Item>
        <Form.Item
          name="lastname"
          label="Lastname"
          rules={[
            {
              required: true,
              message: "Please input your lastname!",
            },
          ]}
        >
          <Input placeholder="Enter lastname" />
        </Form.Item>
        <Form.Item
          name="address"
          label="Address"
          rules={[
            {
              required: true,
              message: "Please input your address!",
            },
          ]}
        >
          <Input placeholder="Enter Address" />
        </Form.Item>

        <Form.Item
          name="reason"
          label="Reason"
          rules={[
            {
              required: true,
              message: "Please input the reason for the appointment!",
            },
          ]}
        >
          <Input.TextArea
            showCount
            maxLength={100}
            placeholder="Reason why you want to have an appointment"
          />
        </Form.Item>

        <Form.Item
          name="date"
          label="Appointment Date"
          rules={[
            {
              required: true,
              message: "Please input the appointment date!",
            },
          ]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="time"
          label="Appointment Time"
          rules={[
            {
              required: true,
              message: "Please input the appointment time!",
            },
          ]}
        >
          <TimePicker format="h:mm A" use12Hours style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            SAVE
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default EditAppointmentForm;
