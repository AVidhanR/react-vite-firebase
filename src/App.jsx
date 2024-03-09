import { useEffect, useState } from "react";
import { Auth } from "./components/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "./config/firebase";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  //New custom states
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [newMovTitle, setMovTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);
  const [movieList, setMovieList] = useState([]);
  const [fileUpload, setFileUpload] = useState(null);

  const moviesCollectionRef = collection(db, "examples");
  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
      console.log(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "examples", id);
    await deleteDoc(movieDoc);
  };

  const updateMovie = async (id) => {
    const movieDoc = doc(db, "examples", id);
    await updateDoc(movieDoc, { title: updatedTitle });
  };

  const uploadFile = async () => {
    if (!fileUpload) return;
    const fileUploadRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(fileUploadRef, fileUpload);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMovieList();
  }, []);

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid,
      });
      getMovieList();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Auth />
      <div>
        <input
          placeholder="Movie name"
          onChange={(e) => setMovTitle(e.target.value)}
        />
        <input
          placeholder="Release Date"
          type="number"
          onChange={(e) => {
            setNewReleaseDate(Number(e.target.value));
          }}
        />
        <input
          type="checkbox"
          checked={isNewMovieOscar}
          onChange={(e) => setIsNewMovieOscar(e.target.checked)}
        />
        <label>Received an Oscar</label>
        <button onClick={onSubmitMovie}>Submit movie</button>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
        <button onClick={() => uploadFile()}>Upload file</button>
        <br />
      </div>
      <div>
        {movieList.map((movie) => (
          <div>
            <h1 style={{ color: movie.receivedAnOscar ? "green" : "red" }}>
              {movie.title}
            </h1>
            <p>Date: {movie.releaseDate}</p>
            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>
            <input
              placeholder="Update Movie Title"
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
            <button onClick={() => updateMovie(movie.id)}>Update Title</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
