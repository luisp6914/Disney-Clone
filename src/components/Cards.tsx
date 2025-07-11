import { useEffect, useRef, useState } from "react";
import type { items } from "../types";
import { Icon } from "@iconify/react/dist/iconify.js";

interface props{
    data : items[]
}

const Cards= ({data} : props) => {
    const cardRefs = useRef<(HTMLButtonElement | null)[] >([]);
    const modalRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [validImages, setValidImages] = useState<boolean[]>([]);

    useEffect(() => {
        //Makes sure the first card is focused on mount
        cardRefs.current[0]?.focus();

        const checkImageIsValid = async () => {
            const checks = await Promise.all(
                data.map((item) => {
                    return new Promise<boolean>((resolve) => {
                        const img = new Image();
                        const src = item.image.tile["1.78"].program ? item.image.tile["1.78"].program.default.url : 
                                    item.image.tile["1.78"].series.default.url;
                        
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

    const handleKeyDown = (e : React.KeyboardEvent<HTMLDivElement>) => {
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

    return(
        <>
            <div className="card-container" tabIndex={0} onKeyDown={handleKeyDown}>
                {data.map((item, index) => (
                    <div key={index}>
                        <button type="button" className="movie-card" ref={(el) => {cardRefs.current[index] = el}} tabIndex={-1} data-bs-toggle="modal" data-bs-target={`#${item.contentId}`}>
                            {validImages[index] ? 

                            <img className="movie" src={
                                item.image.tile["1.78"].program ? item.image.tile["1.78"].program.default.url :
                                item.image.tile["1.78"].series.default.url
                            } alt={item.text.title.full.program ? `${item.text.title.full.program.default.content} image` :
                                `${item.text.title.full.series.default.content} image`
                            } aria-labelledby={item.text.title.full.program ? `${item.text.title.full.program.default.content} image` :
                                `${item.text.title.full.series.default.content} image`} loading="lazy"/> : 
                            
                            <div className="movie" style={{border: "2px solid #fff"}}>
                                <h1>{item.text.title.full.program ? item.text.title.full.program.default.content : item.text.title.full.series.default.content}</h1>
                            </div>
                            
                            }
                        </button>

                        <div className="modal fade" ref={(el) => {modalRefs.current[index] = el}} id={item.contentId} data-bs-keyboard="true" aria-labelledby={item.text.title.full.program ? `${item.text.title.full.program.default.content} image` : `${item.text.title.full.series.default.content} image`} aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-lg">
                                <div className="modal-content"
                                     style={{backgroundImage: `url(${item.image.background ? item.image.background["1.78"].program ? 
                                                                    item.image.background["1.78"].program.default.url : 
                                                                    item.image.background["1.78"].series.default.url : 
                                                                    item.image.background_details["1.78"].series.default.url})`}}>
                                    <div className="modal-header" >
                                        <h1>{item.text.title.full.program ? item.text.title.full.program.default.content : item.text.title.full.series.default.content}</h1>
                                    </div>
                                    <div className="modal-body">
                                        <p>{`${item.releases[0].releaseYear} ●  ${item.type} ●  ${item.text.title.full.program ? item.text.title.full.program.default.language.toUpperCase() : item.text.title.full.series.default.language.toUpperCase()}`}</p>
                                        <div className="btn-container" tabIndex={0}>
                                            <button className="btn play-btn" id={`play-btn-${index}`} tabIndex={-1}>
                                                <Icon className="modal-icons" icon="line-md:play" width="48" height="48" />
                                            </button>
                                            <button className="btn trailer-btn" id={`trailer-btn-${index}`} tabIndex={-1} >TRAILER</button>
                                            <button className="btn add-btn" id={`add-btn-${index}`} tabIndex={-1}>
                                                <Icon className="modal-icons" icon="tabler:plus" width="48" height="48" />
                                            </button>
                                        </div>
                                        <div style={{marginTop: "2rem"}}>
                                            <p>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
                                                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="end-spacer" aria-hidden="true"></div>
            </div>
        </>
    );
}

export default Cards;