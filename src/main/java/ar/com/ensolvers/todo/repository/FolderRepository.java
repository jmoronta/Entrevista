package ar.com.ensolvers.todo.repository;

import ar.com.ensolvers.todo.domain.Folder;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Folder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FolderRepository extends JpaRepository<Folder, Long> {}
