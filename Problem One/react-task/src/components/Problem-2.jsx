import React, { useState, useEffect } from "react";
import {
  Outlet,
  useNavigate,
  Route,
  Routes,
  Link,
  useParams,
} from "react-router-dom";

const ContactList = ({ country, onlyEven, search }) => {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://contact.mediusware.com/api/contacts/${
          country ? `country-contacts/${country}/` : ""
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          params: {
            page,
            page_size: 10,
            search,
            ...(onlyEven ? { id__is_even: true } : {}),
          },
        }
      );
      console.log("response", response);
      console.log("response", response.Response);
      const data = await response.json();
      console.log("data", data);
      setContacts((prevContacts) => [...prevContacts, ...data.results]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error loading contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setContacts([]);
    setPage(1);
    loadContacts();
  }, [country, onlyEven, search]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (scrollTop + clientHeight >= scrollHeight - 50 && !loading) {
      loadContacts();
    }
  };

  return (
    <div style={{ height: "400px", overflowY: "auto" }} onScroll={handleScroll}>
      {contacts.map((contact) => (
        <div key={contact.id}>
          <Link to={`contact/${contact.id}`}>
            <p>{contact.phone}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

const ContactDetails = () => {
  const { contactId } = useParams();
  // Fetch contact details based on contactId from the API and display them
  // ...

  return (
    <div>
      <h2>Contact Details for ID: {contactId}</h2>
      {/* Display contact details */}
    </div>
  );
};

const Modal = ({ country, onlyEven, search }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div>
      <button onClick={handleClose}>Close</button>
      <h2>{country ? `Contacts from ${country}` : "All Contacts"}</h2>
      <ContactList country={country} onlyEven={onlyEven} search={search} />
    </div>
  );
};

const Problem2 = () => {
  const [onlyEven, setOnlyEven] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h4 className="text-center text-uppercase mb-5">Problem-2</h4>
        <div className="d-flex justify-content-center gap-3">
          <Link
            to="all"
            className="btn btn-lg btn-outline-primary"
            style={{ color: "#46139f" }}
          >
            All Contacts
          </Link>
          <Link
            to="us"
            className="btn btn-lg btn-outline-warning"
            style={{ color: "#ff7f50" }}
          >
            US Contacts
          </Link>
        </div>
        <div className="d-flex justify-content-center gap-3 mt-3">
          <label>
            Only even{" "}
            <input
              type="checkbox"
              checked={onlyEven}
              onChange={() => setOnlyEven((prev) => !prev)}
            />
          </label>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <Modal country={null} onlyEven={onlyEven} search={search} />
            }
          />
          <Route
            path="all"
            element={
              <Modal country={null} onlyEven={onlyEven} search={search} />
            }
          />
          <Route
            path="us"
            element={<Modal country="US" onlyEven={onlyEven} search={search} />}
          />
          <Route path=":contactId" element={<ContactDetails />} />
        </Routes>
      </div>
      <Outlet />
    </div>
  );
};

export default Problem2;
