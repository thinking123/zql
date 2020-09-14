import React, { useState } from "react";
import S from "./Zql.css";
import { Input, Row, Col, Typography, Button, Divider, Alert } from "antd";
import parse, { getErrorMsg } from "./zql/index.js";

const { TextArea } = Input;
const { Text } = Typography;

function Zql() {
  const [zql, setZql] = useState("");
  const [zqlObj, setZqlObj] = useState("");
  const [errors, setErrors] = useState([]);
  const onParseZql = () => {
    try {
      console.log("you click");
      const _zqlStr = parse(zql);
      console.log("=====_zqlStr ======", _zqlStr);
      setZqlObj(_zqlStr);
      setErrors(getErrorMsg());
    } catch (err) {
      console.error(err);
      setErrors([{ type: "error", msg: err.message || err.toString() }]);
    }
  };

  const renderAlert = () => {
    return errors.map((err) => (
      <Alert key={err.msg} message={err.msg} type={err.type} />
    ));
  };
  return (
    <div className="Zql">
      <Row>
        <Button type="primary" onClick={onParseZql}>
          parse Zql
        </Button>
      </Row>
      <Row>{renderAlert()}</Row>
      <Divider />
      <Row gutter={20}>
        <Col span={12}>
          <TextArea
            rows={20}
            value={zql}
            onChange={(e) => {
              console.log("v : ", e.target.value);
              setZql(e.target.value);
            }}
          />
        </Col>
        <Col span={12}>{zqlObj && <Text copyable>{zqlObj}</Text>}</Col>
      </Row>
    </div>
  );
}

export default Zql;
