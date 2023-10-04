import axios from "axios";
import * as Yup from "yup";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import "./UyelikFormu.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialFormData = {
  name: "",
  email: "",
  password: "",
  position: "",
  agreement: false,
};

function UyelikFormu(props) {
  const { handleAddUser } = props;
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    position: "",
    agreement: false,
  });
  const [isValid, setIsValid] = useState(false);

  const formSchema = Yup.object().shape({
    email: Yup.string()
      .email("Must be a valid email address.")
      .required("Must include email address."),
    name: Yup.string()
      .min(3, "Must be at least 3 characters long.")
      .required("Must include name."),
    password: Yup.string()
      .matches(
        /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
        "Must include uppercase, lowercase, number, symbol and must be at least 8 chars long."
      )
      .required("Password is Required"),
    agreement: Yup.boolean().oneOf(
      [true],
      "You must accept Terms and Conditions"
    ),
    position: Yup.string()
      .oneOf(
        ["hr", "sales", "frontend", "backend", "designer"],
        "Must select one of the positions"
      )
      .required("Position is Required"),
  });

  useEffect(() => {
    formSchema.isValid(formData).then((valid) => setIsValid(valid));
  }, [formData]);

  function handleChange(event) {
    const name = event.target.name;
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    const newFormData = { ...formData, [name]: value };

    Yup.reach(formSchema, name)
      .validate(value)
      .then((valid) => {
        setErrors({ ...errors, [name]: "" });
      })
      .catch((err) => {
        setErrors({ ...errors, [name]: err.errors[0] });
      });

    setFormData(newFormData);
  }

  function handleSubmit(event) {
    event.preventDefault();
    axios
      .post("https://reqres.in/api/users", formData)
      .then((res) => {
        handleAddUser(res.data);
        toast.success(res.data.name + " isimli kullanıcı eklendi.");
      })
      .catch((err) => {
        toast.error(err.response.message);
        console.error(err.response.message);
      });
    setFormData(initialFormData);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <div className="top-labels">
        <FormGroup>
          <Label htmlFor="name">İsim</Label>
          <Input
            onChange={handleChange}
            id="name"
            name="name"
            placeholder="Adınızı giriniz"
            type="name"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            onChange={handleChange}
            id="email"
            name="email"
            placeholder="Email adresinizi giriniz"
            type="email"
          />
        </FormGroup>
      </div>
      <FormGroup>
        <Label htmlFor="password">Password</Label>
        <Input
          onChange={handleChange}
          id="password"
          name="password"
          placeholder="Şifre belirleyiniz"
          type="password"
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="dropdown">Rol</Label>
        <Input
          onChange={handleChange}
          id="dropdown"
          name="position"
          type="select"
        >
          <option value="">Lütfen Seçiniz</option>
          <option
            name="position"
            value="frontend"
            onChange={handleChange}
            checked={formData.position === "frontend"}
          >
            Frontend Developer
          </option>
          <option
            name="position"
            value="backend"
            onChange={handleChange}
            checked={formData.position === "backend"}
          >
            Backend Developer
          </option>
          <option
            name="position"
            value="designer"
            onChange={handleChange}
            checked={formData.position === "designer"}
          >
            Graphic Designer
          </option>
          <option
            name="position"
            value="sales"
            onChange={handleChange}
            checked={formData.position === "sales"}
          >
            Sales&Marketing
          </option>
          <option
            name="position"
            value="hr"
            onChange={handleChange}
            checked={formData.position === "hr"}
          >
            HR
          </option>
        </Input>
      </FormGroup>

      <FormGroup checked={formData.agreement}>
        <Input
          onChange={handleChange}
          id="checkbox"
          type="checkbox"
          name="agreement"
        />{" "}
        <Label htmlFor="checkbox" check>
          {" "}
          Şartları ve kullanım koşullarını kabul ediyorum.
        </Label>
      </FormGroup>
      <Button type="submit" disabled={!isValid}>
        Submit
      </Button>
    </Form>
  );
}
export default UyelikFormu;
