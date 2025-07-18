import { useEffect, useRef, useState } from "react";
import type { items } from "../types";
import { Icon } from "@iconify/react/dist/iconify.js";

interface props{
    data : items[]
}

const MovieCards= ({data} : props) => {
    const cardRefs = useRef<(HTMLButtonElement | null)[] >([]);
    const modalRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [validImages, setValidImages] = useState<boolean[]>([]);
    const CARD_WIDTH = 280;
    const GAP_WIDTH = 32;
    const MAX_SHIFT_INDEX = 9;

    const getTranslateAmount = () => {
        const clampedIndex = Math.min(focusedIndex, MAX_SHIFT_INDEX + .1);
        const shift = clampedIndex * (CARD_WIDTH + GAP_WIDTH);
        
        return `translateX(-${shift}px)`;
    }

    const getBackgroundImage = (item :  items) : string | undefined => {
        try {
            if(item.image?.background?.["1.78"]?.program?.default?.url){
                return item.image.background["1.78"].program.default.url;
            }
            if(item.image?.background?.["1.78"]?.series?.default?.url){
                return item.image.background["1.78"].series.default.url;
            }
            if(item.image?.background_details?.["1.78"]?.series?.default?.url){
                return item.image.background_details["1.78"].series.default.url;
            }
            if(item.image?.tile?.["1.78"]?.default?.default?.url){
                return item.image.tile["1.78"].default.default.url;
            }
            
            return undefined
        } catch (error) {
            console.error("Wrong background Image Structure", error);
            return undefined
        }
    }

    const getTitleImage = (item : items) : string | undefined => {
        try {
            if(item.image?.tile?.["1.78"]?.program?.default?.url){
                return item.image.tile["1.78"].program.default.url;
            } else if(item.image?.tile?.["1.78"]?.series?.default?.url){
                return item.image.tile["1.78"].series.default.url;
            } else if(item.image?.tile?.["1.78"]?.default?.default?.url){
                return item.image.tile["1.78"].default.default.url;
            } else{
                return undefined;
            }
        } catch (error) {
            console.error("Wrong title image structure", error);
            return undefined
        }
    }

    const getTitleContent = (item : items) : string | undefined => {
        try {
            if(item.text?.title?.full?.program?.default?.content){
                return `${item.text.title.full.program.default.content} image`;
            } else if(item.text?.title?.full?.series?.default?.content){
                return `${item.text.title.full.series.default.content} image`;
            } else if(item.text?.title?.full?.collection?.default?.content){
                return `${item.text.title.full.collection.default.content} image`;
            }
            return undefined;
        } catch (error) {
            console.error("Wrong text structure", error);
            return undefined;
        }
    }

    useEffect(() => {
        //Makes sure the first card is focused on mount
        // console.log(cardRefs.current[1]);
        cardRefs.current[0]?.focus();

        const checkImageIsValid = async () => {
            const checks = await Promise.all(
                data.map((item) => {
                    return new Promise<boolean>((resolve) => {
                        const img = new Image();
                        const src = item.image.tile["1.78"].program ? item.image.tile["1.78"].program.default.url : 
                                    item.image.tile["1.78"].series ? item.image.tile["1.78"].series.default.url : 
                                    item.image.tile["1.78"].default.default.url;
                        
                        img.src = src;

                        img.onload = () => resolve(true);
                        img.onerror = () => resolve(false);

                    });
                })
            );

            setValidImages(checks);
        }; 
        
        checkImageIsValid();
    }, [])

    const handleKeyDownOnCards = (e : React.KeyboardEvent<HTMLDivElement>) => {
        if(e.key === "ArrowRight"){
            setFocusedIndex((prev) => {
                const next = Math.min(prev + 1, data.length - 1);
                cardRefs.current[next]?.focus();
                return next;
            });
        }
        else if(e.key === "ArrowLeft"){
            setFocusedIndex((prev) => {
                const next = Math.max(prev - 1, 0);
                cardRefs.current[next]?.focus();
                return next;
            })
        }
        else if(e.key === "Enter"){
            cardRefs.current[focusedIndex]?.click();

            //Focus the modal
            const modal = modalRefs.current[focusedIndex];

            const onShowModal = () => {
                const btn = modal?.querySelector(`#play-btn-${focusedIndex}`) as HTMLButtonElement;
                btn?.focus();
                modal?.removeEventListener("shown.bs.modal", onShowModal);
            }

            modal?.addEventListener("shown.bs.modal", onShowModal);

        }
        
    }

    const handleKeyDownOnModal = (e : React.KeyboardEvent<HTMLDivElement>) => {
        if(document.querySelector(".modal.show")){
            const modal = modalRefs.current[focusedIndex];
            const btnContainer = modal?.querySelector(".btn-container");
            const buttons = btnContainer?.querySelectorAll("button");
            
            if(!buttons) return;

            const btnArray = Array.from(buttons);
            const currentIndex = btnArray.findIndex(
                (btn) => btn === document.activeElement
            );

            if(e.key === "ArrowRight"){
                const nextIndex = Math.min(currentIndex + 1, btnArray.length - 1);
                btnArray[nextIndex]?.focus();

            }
            else if(e.key === "ArrowLeft"){
                const prevIndex = Math.max(currentIndex - 1, 0);
                btnArray[prevIndex]?.focus();
            }

            return;
        }
    }

    return(
        <>
            <div className="card-container" tabIndex={0} onKeyDown={handleKeyDownOnCards} style={{transform: getTranslateAmount(), transition: "transform 0.3s ease-in-out"}}>
                {data.map((item, index) => (
                    <div key={index}>
                        <button type="button" className="movie-card" ref={(el) => {cardRefs.current[index] = el}} tabIndex={-1} data-bs-toggle="modal" data-bs-target={`#${item.contentId}`}>
                            {validImages[index] ? 

                            <img className="movie" src={getTitleImage(item)} alt={getTitleContent(item)} aria-labelledby={getTitleContent(item)} loading="lazy"/> : 
                            
                            <div className="movie">
                                <h1>{getTitleContent(item)}</h1>
                            </div>
                            
                            }
                        </button>
                    </div>
                ))}

                <div className="end-spacer" aria-hidden="true"></div>
            </div>
            <div onKeyDown={handleKeyDownOnModal}>
                {data.map((item, index) => (
                    <div className="modal fade" ref={(el) => { modalRefs.current[index] = el }} id={item.contentId} data-bs-keyboard="true" aria-labelledby={getTitleContent(item)} aria-hidden="true" key={index}>
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content" style={{backgroundImage: `url(${getBackgroundImage(item)})`}}>
                                <div className="modal-header" >
                                    <h1>{getTitleContent(item)}</h1>
                                </div>
                                <div className="modal-body">
                                    <p>{item.releases ? `${item.releases[0].releaseYear} ● ` : ""} {item.type ? `${item.type} ● ` : ""}  {`${item.text.title.full.program ? item.text.title.full.program.default.language.toUpperCase() : item.text.title.full.series ? item.text.title.full.series.default.language.toUpperCase() : item.text.title.full.collection.default.language.toUpperCase()}`}</p>
                                    <div className="btn-container" tabIndex={0}>
                                        <button className="btn play-btn" id={`play-btn-${index}`} tabIndex={-1}>
                                            <Icon className="modal-icons" icon="line-md:play" width="48" height="48" />
                                        </button>
                                        <button className="btn trailer-btn" id={`trailer-btn-${index}`} tabIndex={-1} >TRAILER</button>
                                        <button className="btn add-btn" id={`add-btn-${index}`} tabIndex={-1}>
                                            <Icon className="modal-icons" icon="tabler:plus" width="48" height="48" />
                                        </button>
                                    </div>
                                    <div style={{ marginTop: "2rem" }}>
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
                                            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default MovieCards;