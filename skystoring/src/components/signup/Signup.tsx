import React, { useState } from "react";
import axios from "axios";
import { CascaderProps, message } from "antd";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

const { Option } = Select;

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onFinish = async (values: any) => {
    try {
      const response = await axios.post("http://localhost:8000/auth/signup/", {
        username: values.Username,
        email: values.email,
        password: values.password,
      });

      navigate("/signin");
    } catch (error) {
      console.error("Signup error:", error);
      message.error("Failed to sign up. Please check your information.");
    }
  };

  return (
    <div className="body">
      <div style={{ height: "100%", width: "40%", margin: "0 auto" }}>
        <div className="signup-container">
          <div className="signup-container2">
            <Form
              name="register"
              onFinish={onFinish}
              initialValues={{
                residence: ["zhejiang", "hangzhou", "xihu"],
                prefix: "86",
              }}
              style={{ maxWidth: 600 }}
              scrollToFirstError
            >
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <h2 className="text">create your account and join HOARD</h2>
              </div>
              <div className="input-wrapper">
                <Form.Item
                  name="Username"
                  tooltip="What do you want others to call you?"
                  rules={[
                    {
                      required: true,
                      message: "Please input your nickname!",
                      whitespace: true,
                    },
                  ]}
                >
                  <Input
                    prefix={
                      <UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  rules={[
                    {
                      type: "email",
                      message: "The input is not a valid E-mail!",
                    },
                    { required: true, message: "Please input your E-mail!" },
                  ]}
                >
                  <Input
                    prefix={
                      <MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    prefix={
                      <LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  name="confirm"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "The new password that you entered does not match!"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={
                      <LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="Confirm password"
                  />
                </Form.Item>
              </div>

              <div
                style={{
                  marginLeft: "80px",
                  textAlign: "center",
                  marginTop: "20px",
                }}
              >
                <p className="link">
                  already have an account ?{" "}
                  <Link to="/signin" className="link1">
                    {" "}
                    login
                  </Link>
                </p>
              </div>

              <div className="but">
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="create-folder-button"
                    size="large"
                    style={{ marginTop: "20px" }}
                  >
                    Register
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
