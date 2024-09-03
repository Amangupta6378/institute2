import React, { useState, useEffect } from "react";
import { db, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "./firebased/firebaseConfig";
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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";
import { MdOutlineAccountCircle, MdLocationOn, MdSchool, MdContactPhone, MdSearch, MdDelete, MdEdit, MdDownload } from "react-icons/md";
import { motion } from "framer-motion";
import { styled } from '@mui/material/styles';
import * as XLSX from 'xlsx';

const GradientCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(to right, #e0f2f1, #b2dfdb)",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  height: "auto",
  marginBottom: theme.spacing(4),
}));

const GradientContainer = styled(Container)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(4),
  overflowY: "auto",
}));

const ShowButton = styled(Button)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: "#004d40",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#003d33",
  },
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: "#b2dfdb",
}));

const FormControlStyled = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: "#b2dfdb",
  borderRadius: "4px",
}));

const SubmitButton = styled(Button)({
  backgroundColor: "#004d40",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#003d33",
  },
});

const TableHeaderCell = styled(TableCell)({
  backgroundColor: "#00796B",
  color: "white",
  textAlign: "center",
  fontWeight: "bold",
});

const TableRowStyled = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#e0f2f1", // Light teal background
  "&:nth-of-type(odd)": {
    backgroundColor: "#b2dfdb", // Alternate row color
  },
  "&:hover": {
    backgroundColor: "#a7c4c1", // Hover effect
  },
}));

const AddStudent = () => {
  const [studentName, setStudentName] = useState("");
  const [address, setAddress] = useState("");
  const [semester, setSemester] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [selectedInstitute, setSelectedInstitute] = useState("");
  const [institutes, setInstitutes] = useState([]);
  const [students, setStudents] = useState([]);
  const [showStudents, setShowStudents] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [editStudentId, setEditStudentId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchInstitutes();  // Fetch institutes on component mount
  }, []);

  useEffect(() => {
    if (showStudents) {
      fetchStudents();  // Fetch students when showing the table
    }
  }, [showStudents]);

  useEffect(() => {
    // Filter students based on search term
    const results = students.filter(student =>
      student.StudentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.Address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.Semester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.ContactNo.toString().includes(searchTerm)
    );
    setFilteredStudents(results);
  }, [searchTerm, students]);

  const fetchInstitutes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "institute123321"));
      const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setInstitutes(data);
    } catch (error) {
      console.error("Error fetching institutes: ", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "students"));
      const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (contactNo.length !== 10) {
      setToastMessage("Contact number must have exactly 10 digits.");
      setShowToast(true);
      return;
    }

    try {
      if (editStudentId) {
        // Update student
        const studentRef = doc(db, "students", editStudentId);
        await updateDoc(studentRef, {
          InstituteId: selectedInstitute,
          StudentName: studentName,
          Address: address,
          Semester: semester,
          ContactNo: contactNo,
        });
      } else {
        // Add new student
        await addDoc(collection(db, "students"), {
          InstituteId: selectedInstitute,
          StudentName: studentName,
          Address: address,
          Semester: semester,
          ContactNo: contactNo,
        });
      }
      setStudentName("");
      setAddress("");
      setSemester("");
      setContactNo("");
      setSelectedInstitute(""); // Clear selection
      setEditStudentId(null); // Clear edit mode
      setToastMessage(editStudentId ? "Student updated successfully." : "Student added successfully.");
      setShowToast(true);
    } catch (error) {
      console.error("Error saving student: ", error);
    }
  };

  const handleEdit = (student) => {
    setStudentName(student.StudentName);
    setAddress(student.Address);
    setSemester(student.Semester);
    setContactNo(student.ContactNo);
    setSelectedInstitute(student.InstituteId);
    setEditStudentId(student.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "students", id));
      fetchStudents(); // Refresh student list
      setToastMessage("Student deleted successfully.");
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting student: ", error);
    }
  };

  const handleToastClose = () => {
    setShowToast(false);
  };

  const handleDownload = () => {
    // Create a new workbook and add a worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(filteredStudents);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    // Generate buffer and create a download link
    const fileName = "students_data.xlsx";
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <GradientContainer maxWidth="md">
      <SearchBar
        fullWidth
        label="Search"
        variant="outlined"
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: <MdSearch style={{ marginRight: 8, color: "#004d40" }} />
        }}
        sx={{ fontFamily: "'Roboto', sans-serif" }}
      />
      <GradientCard>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center" sx={{ marginTop: 4, color: "#004d40", fontFamily: "'Roboto', sans-serif" }}>
            {editStudentId ? "Edit Student" : "Add Student"}
          </Typography>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: '16px' }}
          >
            <FormControlStyled fullWidth>
              <InputLabel id="select-institute-label">Select Institute</InputLabel>
              <Select
                labelId="select-institute-label"
                value={selectedInstitute}
                onChange={(e) => setSelectedInstitute(e.target.value)}
                required
              >
                {institutes.map((institute) => (
                  <MenuItem key={institute.id} value={institute.id}>
                    {institute.Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControlStyled>

            <TextField
              fullWidth
              label="Student Name"
              variant="outlined"
              margin="normal"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
              InputProps={{
                startAdornment: <MdOutlineAccountCircle style={{ marginRight: 8, color: "#004d40" }} />
              }}
            />
            
            <TextField
              fullWidth
              label="Address"
              variant="outlined"
              margin="normal"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              InputProps={{
                startAdornment: <MdLocationOn style={{ marginRight: 8, color: "#004d40" }} />
              }}
            />

            <TextField
              fullWidth
              label="Semester"
              variant="outlined"
              margin="normal"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              required
              InputProps={{
                startAdornment: <MdSchool style={{ marginRight: 8, color: "#004d40" }} />
              }}
            />

            <TextField
              fullWidth
              label="Contact Number"
              variant="outlined"
              margin="normal"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
              required
              InputProps={{
                startAdornment: <MdContactPhone style={{ marginRight: 8, color: "#004d40" }} />
              }}
            />

            <SubmitButton
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, fontFamily: "'Roboto', sans-serif" }}
            >
              {editStudentId ? "Update Student" : "Add Student"}
            </SubmitButton>
          </motion.form>
        </CardContent>
      </GradientCard>

      {showStudents && (
        <TableContainer component={Paper}>
          <Table aria-label="student table">
            <TableHead>
              <TableRow>
                <TableHeaderCell>Student Name</TableHeaderCell>
                <TableHeaderCell>Address</TableHeaderCell>
                <TableHeaderCell>Semester</TableHeaderCell>
                <TableHeaderCell>Contact No</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRowStyled key={student.id}>
                  <TableCell>{student.StudentName}</TableCell>
                  <TableCell>{student.Address}</TableCell>
                  <TableCell>{student.Semester}</TableCell>
                  <TableCell>{student.ContactNo}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEdit(student)}>
                      <MdEdit style={{ color: "#004d40" }} />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(student.id)}>
                      <MdDelete style={{ color: "#d32f2f" }} />
                    </IconButton>
                  </TableCell>
                </TableRowStyled>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ShowButton
        variant="contained"
        onClick={() => setShowStudents(!showStudents)}
      >
        {showStudents ? "Hide Students" : "Show Students"}
      </ShowButton>

      {filteredStudents.length > 0 && (
        <Button
          variant="contained"
          startIcon={<MdDownload />}
          onClick={handleDownload}
          sx={{ mt: 2, backgroundColor: "#004d40", "&:hover": { backgroundColor: "#003d33" } }}
        >
          Download
        </Button>
      )}

      <Snackbar
        open={showToast}
        autoHideDuration={3000}
        onClose={handleToastClose}
      >
        <Alert onClose={handleToastClose} severity="success">
          {toastMessage}
        </Alert>
      </Snackbar>
    </GradientContainer>
  );
};

export default AddStudent;

