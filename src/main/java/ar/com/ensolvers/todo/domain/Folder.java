package ar.com.ensolvers.todo.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Folder.
 */
@Entity
@Table(name = "folder")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Folder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nombre")
    private String nombre;

    @OneToMany(mappedBy = "folder")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "folder" }, allowSetters = true)
    private Set<File> files = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Folder id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Folder nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Set<File> getFiles() {
        return this.files;
    }

    public void setFiles(Set<File> files) {
        if (this.files != null) {
            this.files.forEach(i -> i.setFolder(null));
        }
        if (files != null) {
            files.forEach(i -> i.setFolder(this));
        }
        this.files = files;
    }

    public Folder files(Set<File> files) {
        this.setFiles(files);
        return this;
    }

    public Folder addFile(File file) {
        this.files.add(file);
        file.setFolder(this);
        return this;
    }

    public Folder removeFile(File file) {
        this.files.remove(file);
        file.setFolder(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Folder)) {
            return false;
        }
        return id != null && id.equals(((Folder) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Folder{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            "}";
    }
}
