import { Formik } from 'formik';
import { Form } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import ButtonStyled from '../../../components/Button';
import FormControl from '../../../components/Formik/FormControl';
import { toastSuccess } from '../../../components/ToastNotification';
import authApi from '../../../utils/api/authApi';

import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';

const VerificationForm = ({ action }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const Resend = () => {
        authApi.SendEmail({ email: location.state.email }).then((response) => {
            console.log(response);
            if (response.data.status === 400) {
                console.log(response.data);

                // setErr(response.data.err);
                // response.data.err.map((el) => {
                //     setFieldError(el.at, el.message);
                // });
            }

            if (response.data.status === 200) {
                console.log(response.data.message);
                toastSuccess(response.data.message);
            }
        });
    };
    const onSubmit = (value, { setFieldError }) => {
        console.log(value);

        const formData = {
            email: location.state.email,
            code: value.code,
        };
        authApi.CheckCode(formData).then((response) => {
            console.log(response);
            if (response.data.status === 400) {
                console.log(response.data);
                action(response.data.err);
                // setErr(response.data.err);
                // response.data.err.map((el) => {
                //     setFieldError(el.at, el.message);
                // });
            }

            if (response.data.status === 200) {
                console.log(response.data.message);
                console.log(location.state.email);
                navigate('/resetPassword', { state: location.state.email });
                toastSuccess(response.data.message);
            }
        });
    };
    return (
        <>
            <Formik
                // validationSchema={SchemaRegister}
                onSubmit={onSubmit}
                initialValues={{
                    code: '',
                }}
            >
                {({ handleSubmit, handleChange, handleBlur, values, touched, isValid, errors }) => {
                    return (
                        <Form noValidate onSubmit={handleSubmit}>
                            <>
                                {/* Email*/}
                                <FormControl
                                    control="input"
                                    type="text"
                                    placeholder="Please enter your first name..."
                                    label="Code"
                                    controlId="code"
                                    name="code"
                                    value={values.code}
                                    onChange={handleChange}
                                    isInvalid={touched.code && errors.code}
                                    message={errors.code}
                                />
                                <Stack
                                    direction="horizontal"
                                    className="d-flex justify-content-between"
                                >
                                    <ButtonStyled
                                        buttonType="inverted"
                                        type="button"
                                        onClick={Resend}
                                    >
                                        Resend
                                    </ButtonStyled>
                                    <ButtonStyled type="submit">Submit</ButtonStyled>
                                </Stack>
                            </>
                        </Form>
                    );
                }}
            </Formik>
        </>
    );
};

export default VerificationForm;
