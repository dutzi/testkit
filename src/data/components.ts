import { firestore } from '../firebase';
import { Component, Area } from '../types';

export function getComponents(workspace: string) {
  const components: Component[] = [];

  return firestore
    .collection(`workspaces/${workspace}/components`)
    .get()
    .then(res => {
      return Promise.all(
        res.docs.map(doc => {
          const component: Component = doc.data() as Component;
          component.areas = [];
          components.push(component);
          return firestore
            .collection(`workspaces/${workspace}/components/${doc.id}/areas`)
            .get()
            .then(res => {
              res.docs.forEach(doc => {
                const area: Area = doc.data() as Area;
                component.areas.push(area);
              });
            });
        }),
      );
    })
    .then(() => {
      return components;
    });
}
