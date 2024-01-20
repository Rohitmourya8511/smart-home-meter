import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const ConfigForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const handleFormSubmit = async (values) => {
    console.log(values);
    try {
      // Define your ThingSpeak channel API URL
      const channelID = '1705854'; // Replace with your actual ThingSpeak channel ID
      const apiKey = 'IC63XW5AS9CCD69Q&field1='; // Replace with your actual ThingSpeak Write API key
      const apiUrl = `https://api.thingspeak.com/update?api_key=${apiKey}`;
  
      // Create an object with the data you want to send
      const data = {
        field1: values.phoneNumber, // Replace with the correct field number in your channel
        field2: values.waterTriggerLevel, // Replace with the correct field number
        field3: values.energyTriggerLevel, // Replace with the correct field number
        field4: values.gasTriggergaLevel, // Replace with the correct field number
        field5: values.frequency, // Replace with the correct field number
        field6:true,
        field7:true
      };
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data).toString(),
      });
  
      if (response.ok) {
        console.log('Data sent to ThingSpeak successfully');
        // You can add further handling here if needed
      } else {
        console.error('Failed to send data to ThingSpeak');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box m="20px">
      <Header title="CONFIGURATION   " subtitle="Configuring SMS and Email alerts" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Phone Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phoneNumber}
                name="phoneNumber"
                error={!!touched.phoneNumber && !!errors.phoneNumber}
                helperText={touched.phoneNumber && errors.phoneNumber}
                sx={{ gridColumn: "span 1" }}
              />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Water Trigger Level"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.waterTriggerLevel}
              name="waterTriggerLevel"
              error={!!touched.waterTriggerLevel && !!errors.waterTriggerLevel}
              helperText={touched.waterTriggerLevel && errors.waterTriggerLevel}
              sx={{ gridColumn: "span 1" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Energy Trigger Level"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.energyTriggerLevel}
              name="energyTriggerLevel"
              error={!!touched.energyTriggerLevel && !!errors.energyTriggerLevel}
              helperText={touched.energyTriggerLevel && errors.energyTriggerLevel}
              sx={{ gridColumn: "span 1" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Gas Trigger Level"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.gasTriggergaLevel}
              name="gasTriggergaLevel"
              error={!!touched.gasTriggergaLevel && !!errors.gasTriggergaLevel}
              helperText={touched.gasTriggergaLevel && errors.gasTriggergaLevel}
              sx={{ gridColumn: "span 1" }}
            />
            <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Frequency"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.frequency}
                name="frequency"
                error={!!touched.frequency && !!errors.frequency}
                helperText={touched.frequency && errors.frequency}
                sx={{ gridColumn: "span 1" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Save
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  waterTriggerLevel:yup.string().required("required"),
  energyTriggerLevel:yup.string().required("required"),
  gasTriggergaLevel:yup.string().required("required"),
  frequency: yup.string().required("required"),
  // email: yup.string().email("invalid email").required("required"),
 
});
const initialValues = {
  phoneNumber: "8511280687",
  waterTriggerLevel:"0",
  energyTriggerLevel:"0",
  gasTriggergaLevel:"0",
  frequency: "15",
  // email:"",
};

export default ConfigForm;
