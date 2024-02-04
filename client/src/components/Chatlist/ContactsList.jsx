import { useStateProvider } from "@/context/StateContext";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import { BiArrowBack } from "react-icons/bi";
import { reducerCases } from "@/context/constants";
import { BiSearchAlt2 } from "react-icons/bi";
import ChatLIstItem from "./ChatLIstItem";

function ContactsList() {
  const [allContacts, setAllContacts] = useState([]);
  const [searchTerm, setsearchTerm] = useState("");
  const [searchContacts, setsearchContacts] = useState([]);
  const [{}, dispatch] = useStateProvider();
  // const initialLetters = Object.keys(allContacts);

  useEffect(() => {
    if (searchTerm.length) {
      const filteredData = {};
      Object.keys(allContacts).forEach((key) => {
        filteredData[key] = allContacts[key].filter((obj) =>
          obj.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setsearchContacts(filteredData);
    } else {
      setsearchContacts(allContacts);
    }
  }, [searchTerm]);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const {
          data: { users },
        } = await axios.get(GET_ALL_CONTACTS);
        setAllContacts(users);
        setsearchContacts(users);
        console.log(users);
      } catch (err) {
        console.log(err);
      }
    };
    getContacts();
  }, []);
  return (
    <div className="h-full flex flex-col">
      <div className="h-24 flex items-end px-3 py-4">
        <div className="flex items-center gap-12 text-white ">
          <BiArrowBack
            className="text-xl cursor-pointer"
            onClick={() =>
              dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE })
            }
          />
          <span>New Chat</span>
        </div>
      </div>
      <div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar ">
        <div className="flex py-3 items-center gap-3 h-14">
          <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-4">
            <div>
              <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l" />
            </div>
            <div>
              <input
                type="text"
                placeholder="Search or start a new chat"
                value={searchTerm}
                onChange={(e) => setsearchTerm(e.target.value)}
                className="bg-transparent text-sm focus:outline-none text-white w-full"
              />
            </div>
          </div>
        </div>
        {Object.entries(searchContacts).map(([initialLetter, userList]) => {
          return (
            userList.length > 0 && (
              <div className="" key={Date.now() + initialLetter}>
                <div className="text-teal-light pl-10 py-5">
                  {initialLetter}
                </div>
                {userList.map((contact) => {
                  return (
                    <ChatLIstItem
                      data={contact}
                      isContactPage={true}
                      isContactChat={false}
                      key={contact.id}
                    />
                  );
                })}
              </div>
            )
          );
        })}
      </div>
    </div>
  );
}

export default ContactsList;
