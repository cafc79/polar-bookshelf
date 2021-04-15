import React from 'react';
import {
    ScaleLevelTuple,
    ScaleLevelTuples,
    ScaleLevelTuplesMap
} from "../../ScaleLevels";
import {useDocViewerElementsContext} from "../DocViewerElementsContext";

export namespace EPUBScaler {
    
    const docViewerRef = React.useRef<DocViewer | undefined>(undefined);
    const scaleRef = React.useRef<ScaleLevelTuple>(ScaleLevelTuples[1]);

    const setScale = React.useCallback((scale: ScaleLevelTuple) => {

      if (docViewerRef.current) {
          scaleRef.current = scale;
          docViewerRef.current.viewer.currentScaleValue = scale.value;

          scaleEPUB(parseFloat(scale.value))

          return docViewerRef.current.viewer.currentScale;

      }

      throw new Error("No viewer");

    }, []);

    export const scaleLeveler = React.useCallback((scale: ScaleLevelTuple) => {
      return setScale(scale);
    }, [setScale]);

    export const resize = React.useCallback((): number => {

    if (['page-width', 'page-fit'].includes(scaleRef.current.value)) {
        setScale(scaleRef.current);
    }

    if (docViewerRef.current) {
        return docViewerRef.current.viewer.currentScale;
    } else {
        throw new Error("No viewer");
    }

    }, [setScale]);

    export function scaleEPUB(scale: number) {
        const docViewerElements = useDocViewerElementsContext();
        
        const docViewer = docViewerElements.getDocViewerElement();
        const iframe = docViewer.querySelector(".epub-view iframe") as HTMLIFrameElement;
        if (! iframe) {
            console.warn("No iframe");
            return;
        }

        if (! iframe.contentDocument) {
            console.warn("No contentDocument");
            return;
        }
        
        const items = iframe.contentDocument.body.getElementsByTagName(
            "*"
          ) as HTMLCollectionOf<HTMLElement>;
          const numberRegex = /\d+(?:\.\d+)?/;
          const elements = []

          const createReferenceDiv = (type: string) => {
            const div = document.createElement("div");
            div.id = type === 'em' ? "emDiv" : 'remDiv'
            div.style.height = type === 'em' ? '1em' : '1rem'
            div.style.width = '1px'
            div.style.position = 'absolute'
            div.style.opacity = '0'
            div.innerHTML = " ";
            return div
          }

          const emDiv = createReferenceDiv('em')
          const remDiv = createReferenceDiv('rem')
          
          iframe.contentDocument.body.appendChild(emDiv)
          iframe.contentDocument.body.appendChild(remDiv)

          for (var i = 0; i < items.length; i++) {
            const styles = getComputedStyle(items[i]);
            elements.push({fSize:numberRegex.exec(styles.fontSize),
              lHeight: numberRegex.exec(styles.lineHeight),
              fUnit: styles.fontSize.replace(/[^a-z]/g, ""),
              lUnit: styles.lineHeight.replace(/[^a-z]/g, "")})
          }

          const em = getComputedStyle(iframe.contentDocument.getElementById('emDiv')!)
          const rem = getComputedStyle(iframe.contentDocument.getElementById('remDiv')!)
          
          const formatFont = (value: RegExpExecArray, unit: string) =>{
            let formatted = `${value}${unit}`
            if (value){
              formatted = unit === "em" || unit === "rem" ?
              `${parseFloat(numberRegex.exec(unit === "em" ? em.height : rem.height)![0]) * parseFloat(value[0]) * scale}px` :
              `${parseFloat(value![0]) * scale}${unit}`
            }
            return formatted
          }

          for (var i = 0; i < items.length; i++) {
            const {fSize, lHeight, fUnit, lUnit} = elements[i]
            const font = formatFont(fSize!, fUnit)
            const line = formatFont(lHeight!, lUnit)
            items[i].style.fontSize = font;
            items[i].style.lineHeight = line;
          }

    }
}