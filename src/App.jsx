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

  // fetching the data from the db
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

  // Delete a movie
  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "examples", id);
    await deleteDoc(movieDoc);
  };

  //Update the movie title
  const updateMovie = async (id) => {
    const movieDoc = doc(db, "examples", id);
    await updateDoc(movieDoc, { title: updatedTitle });
  };

  //Upload an image or a file
  const uploadFile = async () => {
    if (!fileUpload) return;
    const fileUploadRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(fileUploadRef, fileUpload);
    } catch (err) {
      console.error(err);
    }
  };

  //Need to run only once every time the site launched or so
  useEffect(() => {
    getMovieList();
  }, []);

  //On submitting the movie details it should be uploaded to the firestore
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
      {/* details */}
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
      {/*  display the movie details from the firestore */}
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
