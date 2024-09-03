import React, { useState, useEffect } from "react";
import {
  db,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "./firebased/firebaseConfig";
import {
  TextField,
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
} from "@mui/material";
import {
  MdOutlineAccountCircle,
  MdLocationOn,
  MdEmail,
  MdDelete,
  MdEdit,
  MdPhone,
  MdPersonAdd,
} from "react-icons/md";
import { styled } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const HeaderCell = styled(TableCell)({
  backgroundColor: "#004d40", // Darker teal green
  color: "white",
  textAlign: "center",
  fontSize: "1rem",
  fontWeight: "bold",
});

const ActionButton = styled(IconButton)(({ color }) => ({
  color: color === "primary" ? "#004d40" : "#004d40",
  "&:hover": {
    backgroundColor: color === "primary" ? "#004d40" : "#004d40", // Darker color for hover
    color: "#fff", // White text and icons on hover
    transform: "scale(1.1)",
    transition: "transform 0.2s",
  },
}));

const FormContainer = styled(Box)({
  background: "linear-gradient(135deg, #80CBC4 30%, #B2DFDB 90%)", // Lighter teal shades
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  marginBottom: "20px",
  maxWidth: "600px",
  margin: "0 auto",
  paddingLeft: "20px",
  paddingRight: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "auto",
});

const SmallButton = styled(Button)({
  backgroundColor: "#80CBC4", // Lighter teal green
  color: "#fff",
  "&:hover": {
    backgroundColor: "#004d40", // Darker teal for hover
    color: "#fff", // White text on hover
  },
});

const AddStudentButton = styled(Button)({
  backgroundColor: "#80CBC4", // Lighter teal green
  color: "#fff",
  '&:hover': {
    backgroundColor: "#004d40", // Darker teal for hover
    color: "#fff", // White text on hover
  },
  marginBottom: '20px', // Add margin to separate from the table
});

const TableCellStyled = styled(TableCell)({
  backgroundColor: "#e0f2f1", // Light teal background for table cells
  color: "#004d40", // Text color
  fontSize: "0.9rem",
  textAlign: "center",
});

function InstituteManagement() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [institutes, setInstitutes] = useState([]);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const fetchInstitutes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "institute123321"));
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setInstitutes(data);
    } catch (error) {
      console.error("Error fetching institutes: ", error);
    }
  };

  const validateForm = () => {
    if (!name || !address || !contact || !email) {
      toast.error("Please fill in all fields");
      return false;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Invalid email format");
      return false;
    }

    // Contact number validation
    const contactPattern = /^\d{10}$/;
    if (!contactPattern.test(contact)) {
      toast.error("Contact number must be exactly 10 digits");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isEditing) {
      try {
        const instituteRef = doc(db, "institute123321", selectedInstitute.id);
        await updateDoc(instituteRef, {
          Name: name,
          Address: address,
          Contacts: contact,
          email: email,
        });
        setIsEditing(false);
        toast.success("Institute updated successfully");
      } catch (error) {
        console.error("Error updating document: ", error);
        toast.error("Failed to update institute");
      }
    } else {
      try {
        await addDoc(collection(db, "institute123321"), {
          Name: name,
          Address: address,
          Contacts: contact,
          email: email,
        });
        toast.success("Institute added successfully");
      } catch (error) {
        console.error("Error adding document: ", error);
        toast.error("Failed to add institute");
      }
    }
    setName("");
    setAddress("");
    setContact("");
    setEmail("");
    fetchInstitutes();
  };

  const handleEdit = (institute) => {
    setName(institute.Name);
    setAddress(institute.Address);
    setContact(institute.Contacts);
    setEmail(institute.email);
    setSelectedInstitute(institute);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "institute123321", id));
      fetchInstitutes();
      toast.success("Institute deleted successfully");
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("Failed to delete institute");
    }
  };

  return (
    <Container sx={{ paddingBottom: 6 }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{
          marginTop: 4,
          color: "#004d40",
          fontFamily: "'Roboto', sans-serif",
          fontWeight: "bold",
        }}
      >
        Institute Management
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
        <Link to="/add-student" style={{ textDecoration: "none" }}>
          <AddStudentButton
            variant="contained"
            startIcon={<MdPersonAdd />}
          >
            Add Student
          </AddStudentButton>
        </Link>
      </Box>

      <FormContainer>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            fullWidth
            label="Institute Name"
            variant="outlined"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              startAdornment: (
                <MdOutlineAccountCircle style={{ marginRight: 8, color: "#004d40" }} />
              ),
            }}
            sx={{ fontFamily: "'Roboto', sans-serif" }}
          />
          <TextField
            fullWidth
            label="Address"
            variant="outlined"
            margin="normal"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            InputProps={{
              startAdornment: (
                <MdLocationOn style={{ marginRight: 8, color: "#004d40" }} />
              ),
            }}
            sx={{ fontFamily: "'Roboto', sans-serif" }}
          />
          <TextField
            fullWidth
            label="Contacts"
            variant="outlined"
            margin="normal"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            InputProps={{
              startAdornment: (
                <MdPhone style={{ marginRight: 8, color: "#004d40" }} />
              ),
            }}
            sx={{ fontFamily: "'Roboto', sans-serif" }}
            inputProps={{ maxLength: 10 }} // Limit input to 10 digits
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <MdEmail style={{ marginRight: 8, color: "#004d40" }} />
              ),
            }}
            sx={{ fontFamily: "'Roboto', sans-serif" }}
          />
          <SmallButton
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              marginTop: 2,
            }}
          >
            {isEditing ? "Update Institute" : "Add Institute"}
          </SmallButton>
        </Box>
      </FormContainer>

      {institutes.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{
            marginTop: 2,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <HeaderCell>Institute Name</HeaderCell>
                <HeaderCell>Address</HeaderCell>
                <HeaderCell>Contacts</HeaderCell>
                <HeaderCell>Email</HeaderCell>
                <HeaderCell>Actions</HeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {institutes.map((institute) => (
                <TableRow key={institute.id}>
                  <TableCellStyled>{institute.Name}</TableCellStyled>
                  <TableCellStyled>{institute.Address}</TableCellStyled>
                  <TableCellStyled>{institute.Contacts}</TableCellStyled>
                  <TableCellStyled>{institute.email}</TableCellStyled>
                  <TableCellStyled>
                    <ActionButton
                      onClick={() => handleEdit(institute)}
                      color="primary"
                    >
                      <MdEdit />
                    </ActionButton>
                    <ActionButton
                      onClick={() => handleDelete(institute.id)}
                      color="secondary"
                    >
                      <MdDelete />
                    </ActionButton>
                  </TableCellStyled>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ToastContainer />
    </Container>
  );
}

export default InstituteManagement;
